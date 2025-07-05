"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter, usePathname } from "next/navigation"
import { GameSelection } from "./game-selection"
import { QuizGame } from "./quiz-game"
import { DailyLock } from "./daily-lock"
import { ScoreSummary } from "./score-summary"
import { hasCompletedGameToday, markGameCompleted, getTodayGameCompletionData, getGameById } from "@/lib/game-utils"
import type { Quiz, CompletionData, GameType } from "@/lib/types"
import { fetchQuiz, submitQuizAnswers } from "@/lib/api"

export function FutQuizApp() {
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams()
  
  const [gameState, setGameState] = useState<"loading" | "selection" | "locked" | "playing" | "completed">("loading")
  const [selectedGame, setSelectedGame] = useState<GameType | null>(null)
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null)
  const [completionData, setCompletionData] = useState<CompletionData | null>(null)
  const [timerEnabled, setTimerEnabled] = useState(false)
  const [timerSeconds, setTimerSeconds] = useState(30)

  // Extract game ID from URL and load the corresponding game
  useEffect(() => {
    const loadGameFromUrl = async () => {
      const gameId = params?.gameId as string
      const isCompletedPath = pathname?.endsWith('/completed')
      
      if (!gameId) {
        // If no game ID in URL, show game selection
        setGameState("selection")
        return
      }

      const game = getGameById(gameId)
      if (!game) {
        // If invalid game ID, redirect to game selection
        router.push('/games')
        return
      }

      // Get timer settings from URL query params
      let timerEnabled = false;
      let timerSeconds = 30;
      
      if (typeof window !== 'undefined') {
        const searchParams = new URLSearchParams(window.location.search);
        timerEnabled = searchParams.get('timer') === 'true';
        const seconds = searchParams.get('seconds');
        if (seconds) {
          timerSeconds = parseInt(seconds, 10) || 30;
        }
      }

      setSelectedGame(game)
      setTimerEnabled(timerEnabled)
      setTimerSeconds(timerSeconds)
      
      if (hasCompletedGameToday(game.id) || isCompletedPath) {
        const completion = getTodayGameCompletionData(game.id)
        setCompletionData(completion)
        setGameState("completed")
      } else {
        // Load quiz data when a game is selected
        const loadQuiz = async () => {
          try {
            setGameState("loading")
            const quiz = await fetchQuiz()
            setCurrentQuiz(quiz)
            setGameState("playing")
          } catch (error) {
            console.error("Failed to load quiz:", error)
            // Handle error state
            setGameState("selection")
          }
        }

        loadQuiz()
      }
    }

    loadGameFromUrl()
  }, [params?.gameId, pathname, router])

  const handleGameSelect = (game: GameType, enableTimer: boolean, seconds: number) => {
    setSelectedGame(game)
    setTimerEnabled(enableTimer)
    setTimerSeconds(seconds)
    
    // Update the URL to reflect the selected game
    router.push(`/games/${game.id}`)

    if (hasCompletedGameToday(game.id)) {
      const completion = getTodayGameCompletionData(game.id)
      setCompletionData(completion)
      setGameState("completed")
    } else {
      const loadQuiz = async () => {
        try {
          setGameState("loading")
          const quiz = await fetchQuiz()
          setCurrentQuiz(quiz)
          setGameState("playing")
        } catch (error) {
          console.error("Failed to load quiz:", error)
          setGameState("selection")
        }
      }

      loadQuiz()
    }
  }

  const handleQuizComplete = async (score: number, totalQuestions: number) => {
    if (!selectedGame || !currentQuiz) return;

    try {
      const completion: CompletionData = {
        gameId: selectedGame.id,
        gameName: selectedGame.name,
        score,
        totalQuestions,
        completedAt: new Date().toISOString(),
        date: new Date().toDateString(),
        timerUsed: timerEnabled,
        timerSeconds: timerEnabled ? timerSeconds : undefined,
      };

      // Note: We're not submitting answers to the API here anymore
      // because the QuizGame component should handle submitting each answer
      // as the user progresses through the quiz
      
      markGameCompleted(selectedGame.id, completion);
      setCompletionData(completion);
      setGameState("completed");
      
      // Update the URL to show the completed state
      router.push(`/games/${selectedGame.id}/completed`);
    } catch (error) {
      console.error("Failed to complete quiz:", error);
      // Handle error appropriately
    }
  };

  const handleBackToSelection = () => {
    // Navigate back to the games list
    router.push('/games')
    
    // Reset state
    setSelectedGame(null)
    setCurrentQuiz(null)
    setCompletionData(null)
    setTimerEnabled(false)
    setGameState("selection")
  }

  const handlePlayAgain = async () => {
    if (!selectedGame) return;
    
    try {
      // In development, allow replaying the same quiz
      if (process.env.NODE_ENV === "development") {
        localStorage.removeItem(`futquiz_completion_${selectedGame.id}`);
      }
      
      // Navigate to the game URL to reset the state
      router.push(`/games/${selectedGame.id}`);
      
      // Fetch a new quiz
      setGameState("loading");
      const quiz = await fetchQuiz();
      setCurrentQuiz(quiz);
      setCompletionData(null);
      setGameState("playing");
    } catch (error) {
      console.error("Failed to load quiz:", error);
      setGameState("selection");
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
        {gameState === "selection" && <GameSelection />}

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
