import { prisma } from "../lib/prisma";
import { Category } from "@prisma/client";

export const getAllWords = async () => {
  return prisma.word.findMany({
    include: { examples: true },
    orderBy: { createdAt: 'desc' }
  });
};

export const searchWords = async (query: string) => {
  const lowerQuery = query.toLowerCase().trim();
  
  if (!lowerQuery) {
    return { results: [], hasExactMatch: false };
  }
  
  // Buscar coincidencias exactas y parciales
  const words = await prisma.$queryRaw<any[]>`
    SELECT 
      w.id,
      w.quechua,
      w.spanish,
      w.description,
      w.category,
      w."createdAt",
      w."updatedAt",
      -- Calcular puntuación de relevancia
      CASE 
        -- Coincidencia exacta en quechua (máxima prioridad)
        WHEN ${lowerQuery} = ANY(w.quechua) THEN 1
        -- Coincidencia exacta en español
        WHEN ${lowerQuery} = ANY(w.spanish) THEN 2
        -- Coincidencia que comienza con el término en quechua
        WHEN EXISTS (SELECT 1 FROM unnest(w.quechua) AS q WHERE LOWER(q) LIKE ${lowerQuery + '%'}) THEN 3
        -- Coincidencia que comienza con el término en español
        WHEN EXISTS (SELECT 1 FROM unnest(w.spanish) AS s WHERE LOWER(s) LIKE ${lowerQuery + '%'}) THEN 4
        -- Coincidencia parcial en quechua
        WHEN EXISTS (SELECT 1 FROM unnest(w.quechua) AS q WHERE LOWER(q) LIKE ${'%' + lowerQuery + '%'}) THEN 5
        -- Coincidencia parcial en español
        WHEN EXISTS (SELECT 1 FROM unnest(w.spanish) AS s WHERE LOWER(s) LIKE ${'%' + lowerQuery + '%'}) THEN 6
        ELSE 99
      END as relevance
    FROM "Word" w
    WHERE 
      EXISTS (
        SELECT 1 FROM unnest(w.quechua) AS q 
        WHERE LOWER(q) LIKE ${'%' + lowerQuery + '%'}
      )
      OR EXISTS (
        SELECT 1 FROM unnest(w.spanish) AS s 
        WHERE LOWER(s) LIKE ${'%' + lowerQuery + '%'}
      )
    ORDER BY relevance ASC, w.id
  `;
  
  // Separar exactas y parciales
  const exactMatches = words.filter(w => w.relevance === 1 || w.relevance === 2);
  const partialMatches = words.filter(w => w.relevance >= 3);
  
  const hasExactMatch = exactMatches.length > 0;
  
  let finalWords: any[];
  
  if (hasExactMatch) {
    // Máximo 1 exacta + 2 parciales = 3 total
    const exactToShow = exactMatches.slice(0, 1);
    const partialToShow = partialMatches.slice(0, 2);
    finalWords = [...exactToShow, ...partialToShow];
  } else {
    // Máximo 3 parciales
    finalWords = partialMatches.slice(0, 3);
  }
  
  // Obtener ejemplos para cada palabra
  const results = await Promise.all(
    finalWords.map(async (word) => {
      const examples = await prisma.example.findMany({
        where: { wordId: word.id }
      });
      const { relevance, ...wordWithoutRelevance } = word;
      return { ...wordWithoutRelevance, examples };
    })
  );
  
  return { 
    results, 
    hasExactMatch
  };
};

export const getWordById = async (id: number) => {
  return prisma.word.findUnique({
    where: { id },
    include: { examples: true }
  });
};

export const createWord = async (data: {
  quechua: string | string[];
  spanish: string[];
  category: Category;
  description?: string;
  examples?: { quechua: string; spanish: string }[];
}) => {
  const quechuaArray = Array.isArray(data.quechua) ? data.quechua : [data.quechua];
  
  return prisma.word.create({
    data: {
      quechua: quechuaArray.map(s => s.trim().toLowerCase()),
      spanish: data.spanish.map(s => s.trim().toLowerCase()),
      category: data.category,
      description: data.description,
      examples: data.examples && data.examples.length > 0
        ? { create: data.examples }
        : undefined
    },
    include: { examples: true }
  });
};

export const updateWord = async (id: number, data: {
  quechua?: string | string[];
  spanish?: string[];
  category?: Category;
  description?: string;
}) => {
  const updateData: any = {};
  
  if (data.quechua !== undefined) {
    const quechuaArray = Array.isArray(data.quechua) ? data.quechua : [data.quechua];
    updateData.quechua = quechuaArray.map(s => s.trim().toLowerCase());
  }
  if (data.spanish !== undefined) {
    updateData.spanish = data.spanish.map(s => s.trim().toLowerCase());
  }
  if (data.category !== undefined) {
    updateData.category = data.category;
  }
  if (data.description !== undefined) {
    updateData.description = data.description;
  }
  
  return prisma.word.update({
    where: { id },
    data: updateData,
    include: { examples: true }
  });
};

export const deleteWord = async (id: number) => {
  return prisma.word.delete({
    where: { id }
  });
};