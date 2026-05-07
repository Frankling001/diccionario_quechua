import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("❌ DATABASE_URL no está definida en seed");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString,
  }),
});

async function main() {
  console.log("🌱 Iniciando seed...");

  // 🔥 limpiar en orden correcto
  await prisma.example.deleteMany();
  await prisma.suggestion.deleteMany();
  await prisma.word.deleteMany();

  // ✅ insertar datos
  await prisma.word.create({
    data: {
      quechua: "yaku",
      spanish: ["agua"],
      category: "SUSTANTIVO",
      description: "Líquido esencial para la vida",
      examples: {
        create: [
          {
            quechua: "Yaku mikuni",
            spanish: "Yo bebo agua",
          },
          {
            quechua: "Yakuqa kawsaymi",
            spanish: "El agua es vida",
          },
        ],
      },
    },
  });

  await prisma.word.create({
    data: {
      quechua: "wasi",
      spanish: ["casa", "hogar"],
      category: "SUSTANTIVO",
    },
  });

  console.log("✅ Seed ejecutado correctamente");
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });