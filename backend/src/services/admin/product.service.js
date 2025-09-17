
import prisma from "../../prisma/client.js";

export const getAll = () => prisma.product.findMany();

export const create = (data) => prisma.product.create({ data });

export const update = (id, data) =>
  prisma.product.update({ where: { id: Number(id) }, data });

export const remove = (id) =>
  prisma.product.delete({ where: { id: Number(id) } });

export const getStats=async()=>{
  const totalProducts=await prisma.product.count();
  // const totalCategories=await prisma.product.groupBy({  by:['category']}).then(res=>res.length);
  // const totalSuppliers=await prisma.supplier.count();
  return {totalProducts};
  // return {totalProducts,totalCategories,totalSuppliers};
} 