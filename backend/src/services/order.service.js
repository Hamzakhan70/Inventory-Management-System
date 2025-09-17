// src/services/order.service.js

import prisma from "../prisma/client.js";
import AppError from "../utils/AppError.js";

/**
 * orderData = {
 *   customerId: 1,
 *   items: [
 *     { productId: 2, quantity: 3 },
 *     { productId: 5, quantity: 1 }
 *   ]
 * }
 */
export const createOrder = async (orderData) => {
  const { customerId, items } = orderData;

  // Basic validation
  if (!customerId) throw new AppError("customerId is required", 400);
  if (!Array.isArray(items) || items.length === 0) throw new AppError("Order items are required", 400);

  // Aggregate quantities if the same product appears multiple times in the request
  const qtyMap = new Map();
  for (const it of items) {
    if (!it.productId || !Number.isInteger(it.quantity) || it.quantity <= 0) {
      throw new AppError("Each item must have productId and quantity > 0", 400);
    }
    const pid = Number(it.productId);
    qtyMap.set(pid, (qtyMap.get(pid) || 0) + Number(it.quantity));
  }
  const productIds = Array.from(qtyMap.keys());
  if (productIds.length === 0) throw new AppError("No valid items provided", 400);

  // Start a transaction - all DB changes inside succeed or rollback together
  const result = await prisma.$transaction(async (tx) => {
    // 1) Verify customer exists
    const customer = await tx.customer.findUnique({ where: { id: Number(customerId) } });
    if (!customer) throw new AppError("Customer not found", 400);

    // 2) Lock product rows and fetch current price & stock
    //    We use a FOR UPDATE query to lock rows and avoid concurrent decrements leading to oversell.
    //    NOTE: depending on Prisma version, passing JS arrays into $queryRaw works as Postgres array param.
    //    We order by id to reduce deadlock risk.
    const productsRows = await tx.$queryRaw`
      SELECT id, price, quantity
      FROM "Product"
      WHERE id = ANY(${productIds})
      ORDER BY id
      FOR UPDATE
    `;

    // Basic mapping products by id for quick lookup
    const productById = new Map(productsRows.map(r => [Number(r.id), { price: Number(r.price), quantity: Number(r.quantity) }]));

    // 3) Ensure all requested products exist
    for (const pid of productIds) {
      if (!productById.has(pid)) {
        throw new AppError(`Product with id ${pid} not found`, 400);
      }
    }

    // 4) Check stock availability
    for (const [pid, reqQty] of qtyMap) {
      const row = productById.get(pid);
      if (reqQty > row.quantity) {
        throw new AppError(`Insufficient stock for product ${pid}. Available: ${row.quantity}, required: ${reqQty}`, 400);
      }
    }

    // 5) Compute total and create order header
    let total = 0;
    for (const [pid, reqQty] of qtyMap) {
      const row = productById.get(pid);
      total += row.price * reqQty;
    }

    const order = await tx.order.create({
      data: {
        customerId: Number(customerId),
        status: "PENDING",
        total: Number(total)
      }
    });

    // 6) Create OrderItems and decrement stock
    const createdItems = [];
    for (const [pid, reqQty] of qtyMap) {
      const row = productById.get(pid);

      // Create item (price snapshot = current product price)
      const item = await tx.orderItem.create({
        data: {
          orderId: order.id,
          productId: pid,
          quantity: reqQty,
          price: Number(row.price)
        }
      });
      createdItems.push(item);

      // Decrement product stock safely
      await tx.product.update({
        where: { id: pid },
        data: { quantity: { decrement: reqQty } }
      });
    }

    // 7) Optionally: return the created order with items and customer info
    const createdOrder = await tx.order.findUnique({
      where: { id: order.id },
      include: {
        items: { include: { product: true } },
        customer: true
      }
    });

    return createdOrder;
  }, {
    // optional transaction options can go here
  });

  return result;
};



// ✅ Get all orders with pagination, sorting, filtering
export const getOrders = async (query) => {
  const {
    page = 1,
    limit = 5,
    sort = "createdAt",
    order = "desc",
    customerId,
    status
  } = query;

  const skip = (Number(page) - 1) * Number(limit);

  // Filters
  const filters = {};
  if (customerId) filters.customerId = Number(customerId);
  if (status) filters.status = status.toUpperCase();

  // Query
  const orders = await prisma.order.findMany({
    skip,
    take: Number(limit),
    where: filters,
    orderBy: {
      [sort]: order.toLowerCase() === "asc" ? "asc" : "desc"
    },
    include: {
      customer: true,
      items: { include: { product: true } }
    }
  });

  const total = await prisma.order.count({ where: filters });

  return {
    data: orders,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit)
    }
  };
};

// ✅ Get single order by ID
export const getOrderById = async (id) => {
  
  const order = await prisma.order.findUnique({
    where: { id: Number(id) },
    include: {
      customer: true,
      items: { include: { product: true } }
    }
  });

  if (!order) throw new AppError("Order not found", 404);

  return order;
};


export const cancelOrder = async (id) => {
  // Find order
  const order = await prisma.order.findUnique({
    where: { id: Number(id) },
    include: { items: true }
  });

  if (!order) throw new AppError("Order not found", 404);

  if (order.status === "CANCELLED")
    throw new AppError("Order already cancelled", 400);

  if (order.status === "DELIVERED")
    throw new AppError("Delivered orders cannot be cancelled", 400);

  // Restore stock
  for (const item of order.items) {
    await prisma.product.update({
      where: { id: item.productId },
      data: { quantity: { increment: item.quantity } }
    });
  }

  // Update order status
  const cancelledOrder = await prisma.order.update({
    where: { id: Number(id) },
    data: { status: "CANCELLED" },
    include: { customer: true, items: { include: { product: true } } }
  });

  return cancelledOrder;
};

export const updateOrderStatus = async (id, newStatus) => {
  const allowedStatuses = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];
  newStatus = newStatus.toUpperCase();

  if (!allowedStatuses.includes(newStatus)) {
    throw new AppError("Invalid order status", 400);
  }

  const order = await prisma.order.findUnique({
    where: { id: Number(id) },
    include: { items: true }
  });

  if (!order) throw new AppError("Order not found", 404);

  // ❌ Prevent invalid transitions
  if (order.status === "CANCELLED")
    throw new AppError("Cannot update a cancelled order", 400);

  if (order.status === "DELIVERED")
    throw new AppError("Delivered orders cannot change status", 400);

  // Transition rules
  const transitions = {
    PENDING: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["SHIPPED", "CANCELLED"],
    SHIPPED: ["DELIVERED"]
  };

  const allowedNext = transitions[order.status] || [];
  if (!allowedNext.includes(newStatus)) {
    throw new AppError(`Cannot move from ${order.status} to ${newStatus}`, 400);
  }

  const updated = await prisma.order.update({
    where: { id: Number(id) },
    data: { status: newStatus },
    include: { customer: true, items: { include: { product: true } } }
  });

  return updated;
};
