"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, Clock } from "lucide-react"
import type { Quiz } from "@/lib/types"

type GameType = "quiz" | "practice"

interface QuizGameProps {
  quiz: Quiz
  gameType: GameType
  onComplete: (score: number, totalQuestions: number) => void
  timerEnabled?: boolean
  timerSeconds?: number
}

export function QuizGame({ quiz, gameType, onComplete, timerEnabled = false, timerSeconds = 30 }: QuizGameProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState<Array<{ questionId: string; selected: string; correct: string }>>([])

  const [timeLeft, setTimeLeft] = useState<number>(timerSeconds || 30)
  const [timerActive, setTimerActive] = useState(false)

  useEffect(() => {
    if (timerEnabled && timerActive && timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timerEnabled && timeLeft === 0 && !showResult) {
      // Time's up - auto-select no answer or first option
      handleNextQuestion()
    }
  }, [timerEnabled, timerActive, timeLeft, showResult])

  useEffect(() => {
    if (timerEnabled) {
      setTimeLeft(timerSeconds || 30)
      setTimerActive(true)
    }
  }, [currentQuestionIndex, timerEnabled, timerSeconds])

  const currentQuestion = quiz.questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1

  const handleAnswerSelect = (answer: string) => {
    if (showResult) return
    setSelectedAnswer(answer)
  }

  const handleNextQuestion = () => {
    setTimerActive(false)

    // If no answer selected and timer ran out, mark as incorrect
    const finalAnswer = selectedAnswer || ""

    const isCorrect = finalAnswer === currentQuestion.correctAnswer
    const newAnswers = [
      ...answers,
      {
        questionId: currentQuestion.id,
        selected: finalAnswer,
        correct: currentQuestion.correctAnswer,
      },
    ]

    setAnswers(newAnswers)

    if (isCorrect) {
      setScore(score + 1)
    }

    setShowResult(true)

    setTimeout(() => {
      if (isLastQuestion) {
        onComplete(isCorrect ? score + 1 : score, quiz.questions.length)
      } else {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
        setSelectedAnswer(null)
        setShowResult(false)
      }
    }, 1500)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-lg border-2 border-green-100">
        <CardHeader className="bg-green-50">
          <div className="flex justify-between items-center mb-2">
            <CardTitle className="text-lg text-green-700">
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </CardTitle>
            <div className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full">
              Score: {score}/
              {currentQuestionIndex + (showResult && selectedAnswer === currentQuestion.correctAnswer ? 1 : 0)}
            </div>
          </div>
          <Progress value={progress} className="h-2" />
          {timerEnabled && (
            <div className="flex items-center justify-center mt-2">
              <div
                className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                  timeLeft <= 10 ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                }`}
              >
                <Clock className="h-4 w-4" />
                <span>{timeLeft}s</span>
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-800 leading-relaxed">{currentQuestion.question}</h2>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              let buttonClass = "w-full p-4 text-left border-2 transition-all duration-200 hover:border-green-300"

              if (showResult) {
                if (option === currentQuestion.correctAnswer) {
                  buttonClass += " bg-green-100 border-green-500 text-green-800"
                } else if (option === selectedAnswer && option !== currentQuestion.correctAnswer) {
                  buttonClass += " bg-red-100 border-red-500 text-red-800"
                } else {
                  buttonClass += " bg-gray-50 border-gray-200 text-gray-500"
                }
              } else if (selectedAnswer === option) {
                buttonClass += " bg-blue-100 border-blue-500 text-blue-800"
              } else {
                buttonClass += " bg-white border-gray-200 hover:bg-green-50"
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={showResult}
                  className={buttonClass}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{option}</span>
                    {showResult && (
                      <>
                        {option === currentQuestion.correctAnswer && <CheckCircle className="h-5 w-5 text-green-600" />}
                        {option === selectedAnswer && option !== currentQuestion.correctAnswer && (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                      </>
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {!showResult && (
            <Button
              onClick={handleNextQuestion}
              disabled={!selectedAnswer}
              className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-semibold"
            >
              {isLastQuestion ? "Finish Quiz" : "Next Question"}
            </Button>
          )}

          {showResult && (
            <div className="mt-6 p-4 rounded-lg bg-gray-50 border">
              <p className="text-center text-gray-700">
                {selectedAnswer === currentQuestion.correctAnswer ? (
                  <span className="text-green-600 font-semibold">✅ Correct!</span>
                ) : (
                  <span className="text-red-600 font-semibold">❌ Incorrect</span>
                )}
              </p>
              {currentQuestion.explanation && (
                <p className="text-sm text-gray-600 mt-2 text-center">{currentQuestion.explanation}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
