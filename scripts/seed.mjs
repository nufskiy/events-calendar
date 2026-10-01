import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

const now = new Date();
const y = now.getFullYear();
const m = String(now.getMonth() + 1).padStart(2, "0");

const events = [
  {
    id: randomUUID(),
    title: "Открытая лекция: город и культура",
    description:
      "Встреча с урбанистами и кураторами о том, как общественные пространства меняют повседневную жизнь.",
    location: "Центральная библиотека, зал 2",
    startDate: new Date(`${y}-${m}-05T18:00:00`).toISOString(),
    endDate: new Date(`${y}-${m}-05T20:00:00`).toISOString(),
    imageUrl: null,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  },
  {
    id: randomUUID(),
    title: "Фестиваль уличной еды",
    description:
      "Три дня гастрономии: фудтраки, локальные производители, музыка и детская зона.",
    location: "Набережная, сектор B",
    startDate: new Date(`${y}-${m}-12T11:00:00`).toISOString(),
    endDate: new Date(`${y}-${m}-14T22:00:00`).toISOString(),
    imageUrl: null,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  },
  {
    id: randomUUID(),
    title: "Мастер-класс по керамике",
    description: "Создайте свою чашку за один вечер. Все материалы включены.",
    location: "Студия «Глина», ул. Ремесленная 7",
    startDate: new Date(`${y}-${m}-20T17:30:00`).toISOString(),
    endDate: new Date(`${y}-${m}-20T20:00:00`).toISOString(),
    imageUrl: null,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  },
];

const dir = path.join(process.cwd(), "data");
await mkdir(dir, { recursive: true });
await writeFile(
  path.join(dir, "events.json"),
  JSON.stringify(events, null, 2),
  "utf-8",
);
console.log(`Seeded ${events.length} events into data/events.json`);
