import { prisma } from "../lib/prisma";
import { Category, SuggestionStatus } from "@prisma/client";
 
export const createSuggestion = async (data: {
  quechua: string | string[];
  spanish: string[];
  description?: string;
  pronunciation?: string;
  contributorName?: string;
  contributorPlace?: string;
  category?: Category;
}) => {
  const quechuaArray = Array.isArray(data.quechua)
    ? data.quechua
    : [data.quechua];
 
  return prisma.suggestion.create({
    data: {
      quechua: quechuaArray.map((s) => s.trim().toLowerCase()),
      spanish: data.spanish.map((s) => s.trim().toLowerCase()),
      description: data.description,
      pronunciation: data.pronunciation,
      contributorName: data.contributorName,
      contributorPlace: data.contributorPlace,
      category: data.category,
      status: "PENDING",
    },
  });
};
 
export const updateSuggestion = async (
  id: number,
  data: {
    quechua?: string[];
    spanish?: string[];
    description?: string;
    pronunciation?: string;
    contributorName?: string;
    contributorPlace?: string;
    category?: Category;
  }
) => {
  return prisma.suggestion.update({
    where: { id },
    data: {
      ...(data.quechua && { quechua: data.quechua.map((s) => s.trim().toLowerCase()) }),
      ...(data.spanish && { spanish: data.spanish.map((s) => s.trim().toLowerCase()) }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.pronunciation !== undefined && { pronunciation: data.pronunciation }),
      ...(data.contributorName !== undefined && { contributorName: data.contributorName }),
      ...(data.contributorPlace !== undefined && { contributorPlace: data.contributorPlace }),
      ...(data.category && { category: data.category }),
    },
  });
};
 
export const approveSuggestion = async (
  id: number,
  examples: { quechua: string; spanish: string }[] = []
) => {
  const suggestion = await prisma.suggestion.findUnique({ where: { id } });
 
  if (!suggestion) {
    throw new Error("Sugerencia no encontrada");
  }
 
  const newWord = await prisma.word.create({
    data: {
      quechua: suggestion.quechua,
      spanish: suggestion.spanish,
      description: suggestion.description || undefined,
      category: suggestion.category || Category.SUSTANTIVO,
      examples: examples.length > 0 ? { create: examples } : undefined,
    },
    include: { examples: true },
  });
 
  await prisma.suggestion.update({
    where: { id },
    data: { status: "APPROVED" },
  });
 
  return newWord;
};
 
export const rejectSuggestion = async (id: number) => {
  return prisma.suggestion.update({
    where: { id },
    data: { status: "REJECTED" },
  });
};
 
export const getPendingSuggestions = async () => {
  return prisma.suggestion.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "desc" },
  });
};
 
export const getAllSuggestions = async () => {
  return prisma.suggestion.findMany({
    orderBy: { createdAt: "desc" },
  });
};