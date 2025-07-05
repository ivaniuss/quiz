// app/api/quiz/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // adapta a tu ORM

export async function GET() {
  const latestQuiz = await db.query.quizzes.findFirst({
    orderBy: (quizzes, { desc }) => [desc(quizzes.date), desc(quizzes.createdAt)],
  });

  if (!latestQuiz) {
    return NextResponse.json({ error: 'No quiz found' }, { status: 404 });
  }

  const questions = await db.query.questions.findMany({
    where: (questions, { eq }) => eq(questions.quizId, latestQuiz.id),
    columns: {
      id: true,
      text: true,
      options: true,
      correct: true
    }
  });

  // Mapear los campos para que coincidan con el tipo Question
  const formattedQuestions = questions.map(q => ({
    id: q.id,
    question: q.text, // Mapear 'text' a 'question'
    options: q.options,
    correctAnswer: q.correct // Mapear 'correct' a 'correctAnswer'
  }));

  return NextResponse.json({ quizId: latestQuiz.id, questions: formattedQuestions });
}
