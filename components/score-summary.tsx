"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, Target, Calendar, Share2, Clock } from "lucide-react"
import type { CompletionData } from "@/lib/types"
import { Badge } from "@/components/ui/badge"

interface ScoreSummaryProps {
  completionData: CompletionData
  onPlayAgain?: () => void
  onBackToGames: () => void
}

export function ScoreSummary({ completionData, onPlayAgain, onBackToGames }: ScoreSummaryProps) {
  const { score, totalQuestions } = completionData
  const percentage = Math.round((score / totalQuestions) * 100)

  const getScoreMessage = () => {
    if (percentage >= 90) return "Outstanding! ⭐"
    if (percentage >= 80) return "Excellent! 🎉"
    if (percentage >= 70) return "Great job! 👏"
    if (percentage >= 60) return "Good effort! 👍"
    if (percentage >= 50) return "Not bad! 💪"
    return "Keep practicing! ⚽"
  }

  const getScoreColor = () => {
    if (percentage >= 90) return "from-primary to-secondary"
    if (percentage >= 80) return "from-purple-400 to-pink-600"
    if (percentage >= 70) return "from-cyan-400 to-blue-600"
    if (percentage >= 60) return "from-green-400 to-emerald-600"
    if (percentage >= 50) return "from-yellow-400 to-amber-600"
    if (percentage >= 40) return "from-orange-400 to-red-600"
    return "from-red-400 to-red-800"
  }

  const handleShare = async () => {
    const shareText = `I scored ${score}/${totalQuestions} (${percentage}%) on today's FutQuiz! ⚽ Can you beat my score?`

    if (navigator.share) {
      try {
        await navigator.share({
          title: "FutQuiz Score",
          text: shareText,
          url: window.location.href,
        })
      } catch (err) {
        // Fallback to clipboard
        navigator.clipboard.writeText(shareText)
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(shareText)
      alert("Score copied to clipboard!")
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-card/80 backdrop-blur-sm border-2 border-secondary/20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-30"></div>
        <CardHeader className="relative z-10 bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-secondary/20">
          <CardTitle className="text-2xl text-primary font-bold flex items-center justify-center gap-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            <Trophy className="h-6 w-6 text-primary" />
            {completionData.gameName} Complete!
          </CardTitle>
        </CardHeader>

        <CardContent className="p-8">
          <div className="mb-6">
            <div className="relative z-10">
            <div className={`text-6xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r ${getScoreColor()}`}>
              {score}<span className="text-foreground/70">/{totalQuestions}</span>
            </div>
            <div className={`text-2xl font-semibold mb-4 ${getScoreColor()}`}>
              <span className="drop-shadow-[0_0_8px_rgba(255,0,255,0.5)]">{percentage}%</span>
            </div>
            {completionData.timerUsed && (
              <div className="mb-4 animate-pulse">
                <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/30 backdrop-blur-sm">
                  <Clock className="h-3 w-3 mr-1 text-secondary" />
                  Timer: {completionData.timerSeconds}s per question
                </Badge>
              </div>
            )}
            <p className="text-xl text-foreground/90 font-medium mb-2">{getScoreMessage()}</p>
          </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 relative z-10">
            <div className="bg-primary/5 rounded-lg p-4 border border-primary/20 backdrop-blur-sm hover:border-primary/40 transition-colors">
              <Target className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-sm text-foreground/80 font-medium">Accuracy</p>
              <p className="text-lg font-bold text-primary">{percentage}%</p>
            </div>

            <div className="bg-secondary/5 rounded-lg p-4 border border-secondary/20 backdrop-blur-sm hover:border-secondary/40 transition-colors">
              <Trophy className="h-6 w-6 text-secondary mx-auto mb-2" />
              <p className="text-sm text-foreground/80 font-medium">Correct</p>
              <p className="text-lg font-bold text-secondary">{score}</p>
            </div>

            <div className="bg-accent/5 rounded-lg p-4 border border-accent/20 backdrop-blur-sm hover:border-accent/40 transition-colors">
              <Calendar className="h-6 w-6 text-accent-foreground mx-auto mb-2" />
              <p className="text-sm text-foreground/80 font-medium">Total</p>
              <p className="text-lg font-bold text-accent-foreground">{totalQuestions}</p>
            </div>
          </div>

          <div className="space-y-3 relative z-10">
            <Button
              onClick={handleShare}
              className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground py-3 text-lg font-bold hover:opacity-90 transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,0,255,0.5)]"
            >
              <Share2 className="h-5 w-5 mr-2" />
              Share Your Score
            </Button>

            <Button
              onClick={onBackToGames}
              variant="outline"
              className="w-full border-secondary/40 text-foreground hover:bg-secondary/10 hover:border-secondary/60 py-3 text-lg font-semibold transition-all duration-300 hover:shadow-[0_0_10px_rgba(0,255,255,0.3)]"
            >
              Play Other Games
            </Button>

            {onPlayAgain && (
              <Button
                onClick={onPlayAgain}
                variant="ghost"
                className="w-full text-foreground/60 hover:text-foreground hover:bg-foreground/5 py-2 text-sm transition-colors"
              >
                Play Again (Dev Mode)
              </Button>
            )}
          </div>

          <div className="mt-6 text-sm text-foreground/60 text-center">
            <p className="inline-flex items-center justify-center gap-1 animate-pulse">
              <span className="text-primary">🔥</span> Come back tomorrow for a new challenge!
            </p>
            <p className="mt-1 text-foreground/50">New quiz available at midnight</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
