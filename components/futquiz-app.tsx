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
      <div className="min-h-screen bg-gradient-to-br from-cyber-darker via-cyber-darkBlue to-cyber-darker flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.02\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M0 40L40 0H20L0 20M40 40V20L20 40\'/%3E%3C/g%3E%3C/svg%3E")',
          backgroundSize: '40px 40px'
        }}></div>
        <div className="relative z-10 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyber-neonPink mx-auto mb-6"></div>
          <p className="text-cyber-neonCyan text-xl font-mono tracking-wider">INITIALIZING SYSTEM</p>
          <div className="w-64 h-1 bg-cyber-neonPink/20 rounded-full mt-4 mx-auto overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyber-neonPink to-cyber-neonCyan animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyber-darker via-cyber-darkBlue to-cyber-darker relative overflow-hidden">
      {/* Efectos de fondo */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.02\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M0 40L40 0H20L0 20M40 40V20L20 40\'/%3E%3C/g%3E%3C/svg%3E")',
        backgroundSize: '40px 40px'
      }}></div>
      
      {/* Efectos de neón */}
      <div className="absolute inset-0 bg-gradient-to-tr from-cyber-neonPink/5 via-transparent to-cyber-neonCyan/5">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-cyber-neonPink/5 rounded-full mix-blend-soft-light filter blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-cyber-neonCyan/5 rounded-full mix-blend-soft-light filter blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative bg-cyber-darkBlue/80 backdrop-blur-sm border-b border-cyber-neonPink/20 shadow-2xl shadow-cyber-neonPurple/10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-center md:justify-between">
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold font-mono tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyber-neonPink via-cyber-neonPurple to-cyber-neonCyan">
                FUTQUIZ <span className="text-cyber-neonGreen">⚡</span>
              </h1>
              <p className="text-cyber-neonCyan/80 mt-1 text-sm md:text-base font-mono tracking-wider">FOOTBALL CHALLENGE</p>
            </div>
            {selectedGame && gameState !== "selection" && (
              <div className="absolute right-6 top-1/2 -translate-y-1/2 md:static md:transform-none">
                <button
                  onClick={handleBackToSelection}
                  className="relative px-4 py-2 bg-cyber-darkPurple/50 border border-cyber-neonPink/30 rounded-lg text-cyber-neonPink font-mono text-sm md:text-base hover:bg-cyber-neonPink/10 hover:border-cyber-neonPink/50 transition-all duration-300 group whitespace-nowrap"
                >
                  <span className="relative z-10 flex items-center">
                    <span className="mr-2 hidden md:inline">⟵</span> BACK TO GAMES
                  </span>
                  <span className="absolute inset-0 rounded-lg bg-cyber-neonPink/5 group-hover:bg-cyber-neonPink/10 transition-all duration-300"></span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-6xl mx-auto px-4 py-8 z-10">
        <div className="relative bg-cyber-darker/60 backdrop-blur-sm rounded-2xl border border-cyber-neonPink/20 shadow-2xl shadow-cyber-neonPurple/10 overflow-hidden">
          {/* Efecto de brillo sutil */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#ff2a6d10_0%,transparent_70%)] animate-pulse"></div>
          
          <div className="relative z-10 p-6 md:p-8">
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
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative mt-16 pb-8 px-4 text-center z-10">
        <div className="max-w-4xl mx-auto">
          <div className="h-px bg-gradient-to-r from-transparent via-cyber-neonPink/30 to-transparent mb-6"></div>
          <p className="text-cyber-neonCyan/60 text-sm font-mono tracking-wider">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="text-cyber-neonPink/70 font-mono text-sm mt-2 tracking-wider">
            NEW CHALLENGES EVERY DAY AT MIDNIGHT <span className="text-cyber-neonCyan">⏰</span>
          </p>
          <div className="mt-6 flex justify-center space-x-4">
            <span className="text-cyber-neonPurple/50 text-xs font-mono">SYSTEM STATUS: ONLINE</span>
            <span className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-cyber-neonGreen mr-1.5 animate-pulse"></span>
              <span className="text-cyber-neonGreen/80 text-xs font-mono">ACTIVE</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
