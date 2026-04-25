import express from "express";
import cors from "cors";
import prisma from "./lib/prisma";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ message: "API funcionando" });
});

app.get("/api/words", async (_req, res) => {
  try {
    const words = await prisma.word.findMany();
    res.json(words);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener palabras" });
  }
});

app.get("/api/words/search", async (req, res) => {
  try {
    const term = String(req.query.term || "").trim().toLowerCase();
    const direction = String(req.query.direction || "es-qu");

    if (!term) {
      return res.status(400).json({ message: "El término es obligatorio" });
    }

    const sourceLanguage = direction === "es-qu" ? "es" : "qu";

    const words = await prisma.word.findMany({
      where: {
        term,
        language: sourceLanguage,
      },
    });

    return res.json(words);
  } catch (error) {
    return res.status(500).json({ message: "Error al buscar palabra" });
  }
});

app.post("/api/suggestions", async (req, res) => {
  try {
    const { term, language, suggestedMeaning } = req.body;

    if (!term || !language) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const suggestion = await prisma.suggestion.create({
      data: {
        term,
        language,
        suggestedMeaning: suggestedMeaning || null,
      },
    });

    return res.status(201).json(suggestion);
  } catch (error) {
    return res.status(500).json({ message: "Error al guardar sugerencia" });
  }
});

export default app;