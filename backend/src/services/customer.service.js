
import prisma from '../prisma/client.js';
export const createCustomer = async (data) => {
  return prisma.customer.create({
    data: {
      name: data.name,
      email: data.email
    }
  });
};

export const getCustomers = async (query) => {
  const { page = 1, limit = 10 } = query;
  const skip = (page - 1) * limit;

  const customers = await prisma.customer.findMany({
    skip: Number(skip),
    take: Number(limit),
    orderBy: { createdAt: "desc" }
  });

  const total = await prisma.customer.count();

  return {
    data: customers,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit)
    }
  };
};

export const getCustomerById = async (id) => {
  return prisma.customer.findUnique({
    where: { id: Number(id) }
  });
};

export const updateCustomer = async (id, data) => {
  return prisma.customer.update({
    where: { id: Number(id) },
    data
  });
};

export const deleteCustomer = async (id) => {
  return prisma.customer.delete({
    where: { id: Number(id) }
  });
};
