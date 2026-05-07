import { Request, Response } from "express";
import * as wordService from "../services/word.service";

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
    const q = String(req.query.q || "").trim().toLowerCase();

    if (!q) {
      return res.status(400).json({ message: "El término es obligatorio" });
    }

    const words = await wordService.searchWords(q);
    res.json(words);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en búsqueda" });
  }
};

export const createWord = async (req: Request, res: Response) => {
  try {
    const { quechua, spanish } = req.body;

    if (!quechua || !Array.isArray(spanish)) {
      return res.status(400).json({ message: "Datos inválidos" });
    }

    const newWord = await wordService.createWord(req.body);
    res.status(201).json(newWord);
  } catch (error: any) {
    if (error.code === "P2002") {
      return res.status(400).json({ message: "La palabra ya existe" });
    }

    console.error(error);
    res.status(500).json({ message: "Error al crear palabra" });
  }
};