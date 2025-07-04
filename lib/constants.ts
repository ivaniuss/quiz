export enum GamePhase {
  LOADING = "loading",
  SELECTION = "selection",
  LOCKED = "locked",
  PLAYING = "playing",
  COMPLETED = "completed",
}

export enum GameMode {
  QUIZ = "quiz",
  PRACTICE = "practice",
}

export enum QuestionDifficulty {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
}

export enum GameId {
  DAILY_TRIVIA = "daily-trivia",
  PLAYER_GUESS_QUIZ = "player-guess-quiz",
  CLUB_QUIZ = "club-quiz",
}

export const GAME_ICONS = {
  [GameId.DAILY_TRIVIA]: "trophy",
  [GameId.PLAYER_GUESS_QUIZ]: "users",
  [GameId.CLUB_QUIZ]: "target",
} as const
