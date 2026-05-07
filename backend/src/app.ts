import express from "express";
import cors from "cors";
import wordRoutes from "./routes/word.routes";
import suggestionRoutes from "./routes/suggestion.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ message: "API funcionando" });
});

app.use("/api/words", wordRoutes);
app.use("/api/suggestions", suggestionRoutes);

export default app;