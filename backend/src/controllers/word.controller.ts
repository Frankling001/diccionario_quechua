import { Request, Response } from "express";
import * as wordService from "../services/word.service";

const getIntId = (id: string | string[] | undefined): number | null => {
  if (!id) return null;
  const parsed = typeof id === 'string' ? parseInt(id) : parseInt(id[0]);
  return isNaN(parsed) ? null : parsed;
};

export const getWords = async (_req: Request, res: Response) => {
  try {
    const words = await wordService.getAllWords();
    res.json(words);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener palabras" });
  }
};

export const searchWords = async (req: Request, res: Response) => {
  try {
    const q = String(req.query.q || "").trim();

    if (!q) {
      return res.status(400).json({ message: "El término es obligatorio" });
    }

    const { results, hasExactMatch } = await wordService.searchWords(q);
    
    res.json({
      results,
      query: q,
      exactMatch: hasExactMatch,
      total: results.length
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en búsqueda" });
  }
};

export const createWord = async (req: Request, res: Response) => {
  try {
    const { quechua, spanish, category, description, examples } = req.body;

    if (!quechua || !spanish || !Array.isArray(spanish)) {
      return res.status(400).json({ message: "Datos inválidos" });
    }

    const newWord = await wordService.createWord({
      quechua,
      spanish,
      category,
      description,
      examples
    });
    
    res.status(201).json(newWord);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Error al crear palabra" });
  }
};

export const updateWord = async (req: Request, res: Response) => {
  try {
    const id = getIntId(req.params.id);
    
    if (!id) {
      return res.status(400).json({ message: "ID inválido" });
    }
    
    const updated = await wordService.updateWord(id, req.body);
    res.json(updated);
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Palabra no encontrada" });
    }
    console.error(error);
    res.status(500).json({ message: "Error al actualizar palabra" });
  }
};

export const deleteWord = async (req: Request, res: Response) => {
  try {
    const id = getIntId(req.params.id);
    
    if (!id) {
      return res.status(400).json({ message: "ID inválido" });
    }
    
    await wordService.deleteWord(id);
    res.json({ message: "Palabra eliminada correctamente" });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Palabra no encontrada" });
    }
    console.error(error);
    res.status(500).json({ message: "Error al eliminar palabra" });
  }
};