import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL no está definida");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.suggestion.deleteMany();
  await prisma.word.deleteMany();
  await prisma.word.createMany({
    data: [
      { term: "casa", language: "es", translation: "wasi" },
      { term: "agua", language: "es", translation: "yaku" },
      { term: "sol", language: "es", translation: "inti" },
      { term: "wasi", language: "qu", translation: "casa" },
      { term: "yaku", language: "qu", translation: "agua" },
      { term: "inti", language: "qu", translation: "sol" },
      { term: "perro", language: "es", translation: "allqu" },
      { term: "allqu", language:"qu", translation: "perro" },
    ],
  });

  console.log("Datos de prueba insertados correctamente.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });