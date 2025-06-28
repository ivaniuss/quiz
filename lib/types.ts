export interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: string
  explanation?: string
  difficulty?: "easy" | "medium" | "hard"
  category?: string
}

export interface Quiz {
  id: string
  date: string
  title: string
  description?: string
  questions: Question[]
}

export interface CompletionData {
  gameId: string
  gameName: string
  score: number
  totalQuestions: number
  completedAt: string
  date: string
  timerUsed?: boolean
  timerSeconds?: number
}

export interface GameType {
  id: string
  name: string
  description: string
  route: string
  icon: string
  available: boolean
}
