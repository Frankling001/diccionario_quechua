import { prisma } from "../lib/prisma";

export const getAllWords = async () => {
  return prisma.word.findMany({
    include: { examples: true },
  });
};

export const searchWords = async (query: string) => {
  return prisma.word.findMany({
    where: {
      OR: [
        {
          quechua: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          spanish: {
            hasSome: [query],
          },
        },
      ],
    },
    include: { examples: true },
  });
};

export const createWord = async (data: any) => {
  return prisma.word.create({
    data: {
      quechua: data.quechua.trim().toLowerCase(),
      spanish: data.spanish.map((s: string) => s.trim().toLowerCase()),
      category: data.category,
      examples: data.examples
        ? { create: data.examples }
        : undefined,
    },
    include: { examples: true },
  });
};