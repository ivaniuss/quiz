import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { questions, quizzes } from '@/lib/schema';
import { desc, eq } from 'drizzle-orm';

export async function GET() {
  try {
    // Get the latest quiz
    const latestQuiz = await db.query.quizzes.findFirst({
      orderBy: (quizzes, { desc }) => [desc(quizzes.date), desc(quizzes.createdAt)],
    });

    if (!latestQuiz) {
      return NextResponse.json({ error: 'No quiz found' }, { status: 404 });
    }

    // Get all questions for the latest quiz
    const quizQuestions = await db
      .select({
        text: questions.text,
        correct: questions.correct
      })
      .from(questions)
      .where(eq(questions.quizId, latestQuiz.id));

    // Format the response
    const answers = quizQuestions.map(q => ({
      pregunta: q.text,
      respuesta: q.correct
    }));

    return NextResponse.json(answers);
  } catch (error) {
    console.error('Error fetching quiz answers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz answers' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
