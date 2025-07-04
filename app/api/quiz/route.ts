// app/api/quiz/route.ts
import { db } from '@/lib/db';
import { quizzes, questions, gameTypes, categories } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  const today = new Date().toISOString().split('T')[0];

  const [quiz] = await db
    .select()
    .from(quizzes)
    .where(eq(quizzes.date, today));

  if (!quiz) return Response.json({ error: 'No hay quiz' }, { status: 404 });

  const preguntas = await db
    .select()
    .from(questions)
    .where(eq(questions.quizId, quiz.id));

  return Response.json({ quiz, questions: preguntas });
}
