import prisma from "../../prisma/client.js";

export const getAll = () => prisma.product.findMany();

export const create = (data) => prisma.product.create({ data });

export const update = (id, data) =>
  prisma.product.update({ where: { id: Number(id) }, data });

export const remove = (id) =>
  prisma.product.delete({ where: { id: Number(id) } });
