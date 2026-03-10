// src/db/seed.ts
import "dotenv/config";
import { db } from "./index";
import { majors, skills } from "./schema";

async function main() {
  console.log("🌱 Seeding dictionaries...");

  // 1. Наполняем специальности
  console.log("Adding majors...");
  await db.insert(majors).values([
    { name: "Информационные системы и технологии", code: "09.03.02" },
    { name: "Программная инженерия", code: "09.03.04" },
    { name: "Прикладная математика", code: "01.03.04" },
    { name: "Менеджмент", code: "38.03.02" },
    { name: "Экономика", code: "38.03.01" },
  ]).onConflictDoNothing(); // Чтобы не падать при повторном запуске

  // 2. Наполняем навыки
  console.log("Adding skills...");
  await db.insert(skills).values([
    { name: "JavaScript" }, { name: "TypeScript" }, { name: "React" }, 
    { name: "Next.js" }, { name: "Node.js" }, { name: "Python" }, 
    { name: "Java" }, { name: "Spring" }, { name: "SQL" }, 
    { name: "PostgreSQL" }, { name: "Docker" }, { name: "Git" },
    { name: "Figma" }, { name: "1C" }, { name: "C++" }, { name: "C#" }
  ]).onConflictDoNothing();

  console.log("✅ Dictionaries seeded!");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});