import { Request, Response } from "express";
import * as suggestionService from "../services/suggestion.service";

export const createSuggestion = async (req: Request, res: Response) => {
  try {
    const { quechua, spanish } = req.body;

    if (!quechua || !Array.isArray(spanish) || spanish.length === 0) {
      return res.status(400).json({ 
        message: "Datos inválidos. Se requiere quechua y spanish (array)" 
      });
    }

    const newSuggestion = await suggestionService.createSuggestion(req.body);
    res.status(201).json(newSuggestion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear sugerencia" });
  }
};

export const updateSuggestion = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const updated = await suggestionService.updateSuggestion(id, req.body);
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar sugerencia" });
  }
};

export const approveSuggestion = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const { examples = [] } = req.body;

    const approved = await suggestionService.approveSuggestion(id, examples);
    res.json({ message: "Sugerencia aprobada y movida a palabras", data: approved });
  } catch (error: any) {
    if (error.message === "Sugerencia no encontrada") {
      return res.status(404).json({ message: error.message });
    }
    console.error(error);
    res.status(500).json({ message: "Error al aprobar sugerencia" });
  }
};

export const getPendingSuggestions = async (_req: Request, res: Response) => {
  try {
    const suggestions = await suggestionService.getPendingSuggestions();
    res.json(suggestions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener sugerencias" });
  }
};

export const rejectSuggestion = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const rejected = await suggestionService.rejectSuggestion(id);
    res.json({ message: "Sugerencia rechazada", data: rejected });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al rechazar sugerencia" });
  }
};