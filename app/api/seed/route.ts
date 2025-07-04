// app/api/seed/route.ts
import { db } from "@/lib/db";
import { categories, gameTypes, quizzes, questions } from "@/lib/schema";

export async function POST() {
  const categoria = await db
    .insert(categories)
    .values({ name: "Fútbol" })
    .returning();
  const tipo = await db
    .insert(gameTypes)
    .values({ name: "Trivia", categoryId: categoria[0].id })
    .returning();
  const quiz = await db
    .insert(quizzes)
    .values({
      title: "Quiz de hoy",
      date: new Date().toISOString().split("T")[0],
      gameTypeId: tipo[0].id,
    })
    .returning();
  await db.insert(questions).values({
    quizId: quiz[0].id,
    text: "¿Quién ganó el clásico?",
    options: ["Brasil", "Perú", "Empate", "Otro"],
    correct: "Brasil",
  });

  return Response.json({ success: true });
}
