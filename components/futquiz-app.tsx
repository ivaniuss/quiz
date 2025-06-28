"use client"

import { useState, useEffect } from "react"
import { GameSelection } from "./game-selection"
import { QuizGame } from "./quiz-game"
import { DailyLock } from "./daily-lock"
import { ScoreSummary } from "./score-summary"
import { getGameQuiz, hasCompletedGameToday, markGameCompleted, getTodayGameCompletionData } from "@/lib/quiz-data"
import type { Quiz, CompletionData, GameType } from "@/lib/types"

export function FutQuizApp() {
  const [gameState, setGameState] = useState<"loading" | "selection" | "locked" | "playing" | "completed">("loading")
  const [selectedGame, setSelectedGame] = useState<GameType | null>(null)
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null)
  const [completionData, setCompletionData] = useState<CompletionData | null>(null)
  const [timerEnabled, setTimerEnabled] = useState(false)
  const [timerSeconds, setTimerSeconds] = useState(30)

  useEffect(() => {
    // Initialize app - always start with game selection
    setGameState("selection")
  }, [])

  const handleGameSelect = (game: GameType, enableTimer: boolean, seconds: number) => {
    setSelectedGame(game)
    setTimerEnabled(enableTimer)
    setTimerSeconds(seconds)

    if (hasCompletedGameToday(game.id)) {
      const completion = getTodayGameCompletionData(game.id)
      setCompletionData(completion)
      setGameState("completed")
    } else {
      const quiz = getGameQuiz(game.id)
      setCurrentQuiz(quiz)
      setGameState("playing")
    }
  }

  const handleQuizComplete = (score: number, totalQuestions: number) => {
    if (!selectedGame) return

    const completion: CompletionData = {
      gameId: selectedGame.id,
      gameName: selectedGame.name,
      score,
      totalQuestions,
      completedAt: new Date().toISOString(),
      date: new Date().toDateString(),
      timerUsed: timerEnabled,
      timerSeconds: timerEnabled ? timerSeconds : undefined,
    }

    markGameCompleted(selectedGame.id, completion)
    setCompletionData(completion)
    setGameState("completed")
  }

  const handleBackToSelection = () => {
    setSelectedGame(null)
    setCurrentQuiz(null)
    setCompletionData(null)
    setTimerEnabled(false)
    setGameState("selection")
  }

  const handlePlayAgain = () => {
    // Development mode only
    if (process.env.NODE_ENV === "development" && selectedGame) {
      localStorage.removeItem(`futquiz_completion_${selectedGame.id}`)
      const quiz = getGameQuiz(selectedGame.id)
      setCurrentQuiz(quiz)
      setCompletionData(null)
      setGameState("playing")
    }
  }

  if (gameState === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading FutQuiz...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-green-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-green-700">FutQuiz ⚽</h1>
              <p className="text-gray-600 mt-1 text-sm md:text-base">Daily Football Trivia Challenge</p>
            </div>
            {selectedGame && gameState !== "selection" && (
              <button
                onClick={handleBackToSelection}
                className="text-green-600 hover:text-green-700 font-medium text-sm md:text-base"
              >
                ← Back to Games
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {gameState === "selection" && <GameSelection onGameSelect={handleGameSelect} />}

        {gameState === "locked" && selectedGame && <DailyLock gameName={selectedGame.name} />}

        {gameState === "playing" && currentQuiz && selectedGame && (
          <QuizGame
            quiz={currentQuiz}
            gameType={selectedGame}
            onComplete={handleQuizComplete}
            timerEnabled={timerEnabled}
            timerSeconds={timerSeconds}
          />
        )}

        {gameState === "completed" && completionData && (
          <ScoreSummary
            completionData={completionData}
            onPlayAgain={process.env.NODE_ENV === "development" ? handlePlayAgain : undefined}
            onBackToGames={handleBackToSelection}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t-2 border-green-100 mt-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center">
          <p className="text-gray-600 text-sm">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="text-green-600 font-medium mt-1">New challenges every day at midnight ⏰</p>
        </div>
      </footer>
    </div>
  )
}
