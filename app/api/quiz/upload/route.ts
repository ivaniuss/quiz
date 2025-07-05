import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // tu instancia de base de datos
import { quizzes, questions } from "@/lib/schema"; // tus tablas, por ejemplo con drizzle
import { Question } from "@/lib/types";

export async function POST(req: Request) {
  const body = await req.json();
  const { title, date, gameTypeId, questions: questionList } = body;

  // Validar gameTypeId
  const parsedGameTypeId = parseInt(gameTypeId, 10);
  if (isNaN(parsedGameTypeId)) {
    return NextResponse.json(
      { error: 'gameTypeId must be a valid number' },
      { status: 400 }
    );
  }

  try {
    // Insertar quiz
    const [quiz] = await db
      .insert(quizzes)
      .values({ 
        title, 
        date: date ? new Date(date).toISOString() : null,
        gameTypeId: parsedGameTypeId
      })
      .returning();

  const quizId = quiz.id;

  // Insertar preguntas
  await db.insert(questions).values(
    questionList.map((q: Question) => ({
      quizId: quizId,
      text: q.question, // Usamos q.question para coincidir con el tipo Question
      options: q.options,
      correct: q.correctAnswer
    }))
  );

    return NextResponse.json({ success: true, quizId });
  } catch (error: unknown) {
    console.error('Error creating quiz:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to create quiz', details: errorMessage },
      { status: 500 }
    );
  }
}
