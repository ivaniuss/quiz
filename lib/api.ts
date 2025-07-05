import { Quiz } from "./types";

export async function fetchQuiz(quizId?: string): Promise<Quiz> {
  const url = quizId ? `/api/quiz/${quizId}` : '/api/quiz';
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch quiz');
  }
  
  return response.json();
}

export async function submitQuizAnswers(questionId: string, selectedOption: string): Promise<{ correct: boolean }> {
  const response = await fetch('/api/quiz/answer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ questionId, selectedOption }),
  });

  if (!response.ok) {
    throw new Error('Failed to submit answer');
  }

  return response.json();
}
