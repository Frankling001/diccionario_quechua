import { Request, Response } from "express";
import * as suggestionService from "../services/suggestion.service";

// Helper para obtener ID de params
const getIntId = (id: string | string[] | undefined): number | null => {
  if (!id) return null;
  const parsed = typeof id === 'string' ? parseInt(id) : parseInt(id[0]);
  return isNaN(parsed) ? null : parsed;
};

export const createSuggestion = async (req: Request, res: Response) => {
  try {
    const { quechua, spanish, description, category } = req.body;

    if (!quechua || !Array.isArray(spanish) || spanish.length === 0) {
      return res.status(400).json({ 
        message: "Datos inválidos. Se requiere quechua y spanish (array)" 
      });
    }

    const newSuggestion = await suggestionService.createSuggestion({
      quechua,
      spanish,
      description,
      category
    });
    
    res.status(201).json(newSuggestion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear sugerencia" });
  }
};

export const updateSuggestion = async (req: Request, res: Response) => {
  try {
    const id = getIntId(req.params.id);
    
    if (!id) {
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
    const id = getIntId(req.params.id);
    
    if (!id) {
      return res.status(400).json({ message: "ID inválido" });
    }
    
    const { examples = [] } = req.body;

    const newWord = await suggestionService.approveSuggestion(id, examples);
    res.json({ 
      message: "Sugerencia aprobada y movida a palabras", 
      data: newWord 
    });
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
    const id = getIntId(req.params.id);
    
    if (!id) {
      return res.status(400).json({ message: "ID inválido" });
    }
    
    const rejected = await suggestionService.rejectSuggestion(id);
    res.json({ message: "Sugerencia rechazada", data: rejected });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al rechazar sugerencia" });
  }
};