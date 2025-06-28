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
    if (percentage >= 80) return "text-green-600"
    if (percentage >= 60) return "text-blue-600"
    if (percentage >= 40) return "text-yellow-600"
    return "text-red-600"
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
      <Card className="shadow-lg border-2 border-green-100 text-center">
        <CardHeader className="bg-green-50">
          <CardTitle className="text-2xl text-green-700 flex items-center justify-center gap-2">
            <Trophy className="h-6 w-6" />
            {completionData.gameName} Complete!
          </CardTitle>
        </CardHeader>

        <CardContent className="p-8">
          <div className="mb-6">
            <div className={`text-6xl font-bold mb-2 ${getScoreColor()}`}>
              {score}/{totalQuestions}
            </div>
            <div className={`text-2xl font-semibold mb-4 ${getScoreColor()}`}>{percentage}%</div>
            {completionData.timerUsed && (
              <div className="mb-4">
                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                  <Clock className="h-3 w-3 mr-1" />
                  Timer: {completionData.timerSeconds}s per question
                </Badge>
              </div>
            )}
            <p className="text-xl text-gray-700 mb-2">{getScoreMessage()}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <Target className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-blue-700 font-semibold">Accuracy</p>
              <p className="text-lg font-bold text-blue-800">{percentage}%</p>
            </div>

            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <Trophy className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-green-700 font-semibold">Correct</p>
              <p className="text-lg font-bold text-green-800">{score}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <Calendar className="h-6 w-6 text-gray-600 mx-auto mb-2" />
              <p className="text-sm text-gray-700 font-semibold">Total</p>
              <p className="text-lg font-bold text-gray-800">{totalQuestions}</p>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleShare}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
            >
              <Share2 className="h-5 w-5 mr-2" />
              Share Your Score
            </Button>

            <Button
              onClick={onBackToGames}
              variant="outline"
              className="w-full border-green-600 text-green-600 hover:bg-green-50 py-3 text-lg font-semibold bg-transparent"
            >
              Play Other Games
            </Button>

            {onPlayAgain && (
              <Button
                onClick={onPlayAgain}
                variant="outline"
                className="w-full border-gray-300 text-gray-600 hover:bg-gray-50 py-2 text-sm bg-transparent"
              >
                Play Again (Dev Mode)
              </Button>
            )}
          </div>

          <div className="mt-6 text-sm text-gray-500">
            <p>🔥 Come back tomorrow for a new challenge!</p>
            <p className="mt-1">New quiz available at midnight</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
