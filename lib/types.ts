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

export interface GameSettings {
  timerEnabled: boolean
  timerSeconds: number
}

export interface GameData {
  currentGame: GameType | null
  currentQuiz: Quiz | null
  completionData: CompletionData | null
}

export interface GameState {
  status: 'idle' | 'loading' | 'success' | 'error'
  error: string | null
  data: GameData
  settings: GameSettings
}
