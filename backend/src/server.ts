import "dotenv/config";
import app from "./app";

const PORT = Number(process.env.PORT) || 3001;

const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor en http://localhost:${PORT}`);
});

server.on("error", (error) => {
  console.error("❌ Error al iniciar servidor:", error);
});