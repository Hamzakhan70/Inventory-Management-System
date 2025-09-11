import prisma from '../prisma/client.js'

export const createSupplier = async (data) => {
  return prisma.supplier.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone
    }
  });
};

export const getSuppliers = async () => {
  return prisma.supplier.findMany({ include: { products: true } });
};

export const getSupplierById = async (id) => {
  return prisma.supplier.findUnique({
    where: { id: Number(id) },
    include: { products: true }
  });
};

export const updateSupplier = async (id, data) => {
  return prisma.supplier.update({
    where: { id: Number(id) },
    data
  });
};

export const deleteSupplier = async (id) => {
  return prisma.supplier.delete({ where: { id: Number(id) } });
};
