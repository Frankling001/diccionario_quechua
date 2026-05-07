import { prisma } from "../lib/prisma";

export const createSuggestion = async (data: any) => {
  return prisma.suggestion.create({
    data: {
      quechua: data.quechua.trim().toLowerCase(),
      spanish: data.spanish.map((s: string) => s.trim().toLowerCase()),
      description: data.description?.trim() || null,
      status: "PENDING",
    },
  });
};

export const updateSuggestion = async (id: number, data: any) => {
  return prisma.suggestion.update({
    where: { id },
    data: {
      description: data.description?.trim() || null,
      category: data.category || null,
    },
  });
};

export const approveSuggestion = async (id: number, examples: any[] = []) => {
  const suggestion = await prisma.suggestion.findUnique({
    where: { id },
  });

  if (!suggestion) {
    throw new Error("Sugerencia no encontrada");
  }

  await prisma.word.create({
    data: {
      quechua: suggestion.quechua,
      spanish: suggestion.spanish,
      description: suggestion.description,
      category: (suggestion as any).category || "SUSTANTIVO",
      examples: {
        create: examples.map((ex) => ({
          quechua: ex.quechua.trim(),
          spanish: ex.spanish.trim(),
        })),
      },
    },
  });

  return prisma.suggestion.update({
    where: { id },
    data: {
      status: "APPROVED",
      updatedAt: new Date(),
    },
  });
};

export const getPendingSuggestions = async () => {
  return prisma.suggestion.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "desc" },
  });
};

export const rejectSuggestion = async (id: number) => {
  return prisma.suggestion.update({
    where: { id },
    data: {
      status: "REJECTED",
      updatedAt: new Date(),
    },
  });
};