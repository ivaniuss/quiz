"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, Clock } from "lucide-react"
import type { Quiz, GameType } from "../lib/types"
import { submitQuizAnswers } from "@/lib/api"

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

  const currentQuestion = quiz.questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1

  // Función para manejar el timeout del temporizador
  const handleTimerTimeout = useCallback(() => {
    if (timerEnabled) {
      setTimerActive(false)
      // Si no se ha seleccionado respuesta, marcar como incorrecta
      if (!selectedAnswer && currentQuestion) {
        const newAnswers = [
          ...answers,
          {
            questionId: currentQuestion.id,
            selected: "",
            correct: currentQuestion.correctAnswer,
          },
        ]
        setAnswers(newAnswers)
        setShowResult(true)

        setTimeout(() => {
          if (isLastQuestion) {
            onComplete(score, quiz.questions.length)
          } else {
            setCurrentQuestionIndex(currentQuestionIndex + 1)
            setSelectedAnswer(null)
            setShowResult(false)
          }
        }, 1500)
      }
    }
  }, [timerEnabled, selectedAnswer, answers, currentQuestion, isLastQuestion, onComplete, score, quiz.questions.length, currentQuestionIndex])

  // Efecto para el temporizador
  useEffect(() => {
    if (timerEnabled && timerActive && timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timerEnabled && timeLeft === 0 && !showResult) {
      // Time's up - manejar timeout
      handleTimerTimeout()
    }
  }, [timerEnabled, timerActive, timeLeft, showResult, handleTimerTimeout])
  
  // Reiniciar el temporizador cuando cambia la pregunta
  useEffect(() => {
    if (timerEnabled) {
      setTimeLeft(timerSeconds || 30)
      setTimerActive(true)
    }
  }, [currentQuestionIndex, timerEnabled, timerSeconds])

  const getButtonVariant = (option: string) => {
    if (!showResult) return 'outline'
    if (option === currentQuestion.correctAnswer) return 'default'
    if (option === selectedAnswer && option !== currentQuestion.correctAnswer) return 'destructive'
    return 'outline'
  }

  const handleAnswerSelect = async (answer: string) => {
    if (showResult) return // Evitar múltiples selecciones
    
    setSelectedAnswer(answer)
    const isCorrect = answer === currentQuestion.correctAnswer
    
    try {
      // Enviar la respuesta al servidor
      const result = await submitQuizAnswers(currentQuestion.id, answer)
      
      const newAnswers = [
        ...answers,
        {
          questionId: currentQuestion.id,
          selected: answer,
          correct: currentQuestion.correctAnswer,
        },
      ]
      
      setAnswers(newAnswers)
      setShowResult(true)
      
      if (isCorrect) {
        setScore(score + 1)
      }
      
      // Desactivar el temporizador cuando se selecciona una respuesta
      setTimerActive(false)
      
      // Mover a la siguiente pregunta después de un breve retraso
      setTimeout(() => {
        if (isLastQuestion) {
          onComplete(score + (isCorrect ? 1 : 0), quiz.questions.length)
        } else {
          setCurrentQuestionIndex(currentQuestionIndex + 1)
          setSelectedAnswer(null)
          setShowResult(false)
          if (timerEnabled) {
            setTimeLeft(timerSeconds)
            setTimerActive(true)
          }
        }
      }, 1500)
    } catch (error) {
      console.error('Error submitting answer:', error)
      // Mostrar un mensaje de error al usuario
      alert('Error al enviar la respuesta. Por favor, inténtalo de nuevo.')
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4" data-testid="quiz-game-container">
      <Card className="shadow-lg border-2 border-green-100">
        <CardHeader className="bg-green-50">
          <div className="flex justify-between items-center mb-2">
            <CardTitle className="text-lg" data-testid="question-counter">Question {currentQuestionIndex + 1} of {quiz.questions.length}</CardTitle>
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

        <CardContent className="p-6" data-testid="quiz-game-container">
          <h2 className="text-xl font-semibold mb-6 text-gray-800 leading-relaxed">{currentQuestion.question}</h2>

          <div className="space-y-4" data-testid="options-container">
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
                <Button
                  key={option}
                  variant={getButtonVariant(option)}
                  className="w-full justify-start text-left h-auto py-3 px-4"
                  onClick={() => handleAnswerSelect(option)}
                  disabled={showResult}
                  data-testid={`option-${currentQuestion.id}-${index}`}
                  data-option-index={index}
                  data-question-id={currentQuestion.id}
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
                </Button>
              )
            })}
          </div>

          {/* Botón de siguiente eliminado para evaluación automática */}

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
