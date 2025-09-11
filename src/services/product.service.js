import prisma from '../prisma/client.js';



export const getProducts = async (query) => {
  const {
    sort = 'createdAt',    // default sorting field
    order = 'desc',        // default sorting order
    minPrice,              // optional filter
    maxPrice,              // optional filter
    minQuantity,
    maxQuantity,
    name,
    page = 1,              // default page
    limit = 5              // default limit
  } = query;
const pageSize = Math.min(Number(limit) || 10, 50); // max 50 items per page

  const skip = (page - 1) * limit;

  // ✅ Build dynamic filters
  const filters = {};

  if (minPrice || maxPrice) {
    filters.price = {};
    if (minPrice) filters.price.gte = Number(minPrice);
    if (maxPrice) filters.price.lte = Number(maxPrice);
  }

  if (minQuantity || maxQuantity) {
    filters.quantity = {};
    if (minQuantity) filters.quantity.gte = Number(minQuantity);
    if (maxQuantity) filters.quantity.lte = Number(maxQuantity);
  }

  if (name) {
    filters.name = {
      contains: name,
      mode: 'insensitive' // case-insensitive search
    };
  }

  // ✅ Query with Prisma
  const products = await prisma.product.findMany({
    skip: Number(skip),
    take: Number(limit),
    where: filters,
    orderBy: {
      [sort]: order.toLowerCase() === 'asc' ? 'asc' : 'desc'
    },
    include: { supplier: true } 
  });
  const total = await prisma.product.count({ where: filters });
  return {
    data: products,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit)
    },
  appliedFilters: filters
  };
};

export const createProduct = async (data) => {
  return prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      price: Number(data.price),
      quantity: Number(data.quantity),
      supplierId: Number(data.supplierId)
    }
  });
};


export const getProductById = async (id) => {
  return prisma.product.findUnique({
    where: { id: Number(id) },
    include: { supplier: true }
  });
};

export const updateProduct = async (id, data) => {
  return prisma.product.update({
    where: { id: Number(id) },
    data
  });
};

export const deleteProduct = async (id) => {
  return prisma.product.delete({ where: { id: Number(id) } });
};
