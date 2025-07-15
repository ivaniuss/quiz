"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

  const handleTimerTimeout = useCallback(() => {
    if (timerEnabled) {
      setTimerActive(false)
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

  useEffect(() => {
    if (timerEnabled && timerActive && timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timerEnabled && timeLeft === 0 && !showResult) {
      handleTimerTimeout()
    }
  }, [timerEnabled, timerActive, timeLeft, showResult, handleTimerTimeout])
  
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
    if (showResult) return
    
    setSelectedAnswer(answer)
    const isCorrect = answer === currentQuestion.correctAnswer
    
    try {
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
      
      setTimerActive(false)
      
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
      alert('Error al enviar la respuesta. Por favor, inténtalo de nuevo.')
    }
  }

  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-cyber-neonPink">Cargando pregunta...</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-4 relative z-10" data-testid="quiz-game-container">
      <Card className="relative overflow-hidden border border-cyber-neonPink/30 bg-cyber-darker/80 backdrop-blur-sm shadow-2xl shadow-cyber-neonPurple/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#ff2a6d10_0%,transparent_70%)] animate-pulse"></div>
        
        <CardHeader className="relative z-10 bg-cyber-darkBlue/50 border-b border-cyber-neonPink/20">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-3">
            <CardTitle className="text-lg font-mono tracking-wider text-cyber-neonCyan" data-testid="question-counter">
              <span className="text-cyber-neonPink">[</span> QUESTION {currentQuestionIndex + 1} / {quiz.questions.length} <span className="text-cyber-neonPink">]</span>
            </CardTitle>
            <div className="text-sm font-mono tracking-wider bg-cyber-darker/80 border border-cyber-neonCyan/30 text-cyber-neonCyan px-4 py-1.5 rounded-full shadow-lg shadow-cyber-neonCyan/10">
              SCORE: <span className="text-cyber-neonGreen font-bold">{score}</span>/
              <span className="text-cyber-neonPink">{currentQuestionIndex + (showResult && selectedAnswer === currentQuestion.correctAnswer ? 1 : 0)}</span>
            </div>
          </div>
          
          <div className="relative pt-1">
            <div className="relative h-1.5 bg-cyber-darker/70 border border-cyber-neonPink/20 overflow-hidden rounded-full">
              <div 
                className="h-full bg-gradient-to-r from-cyber-neonPink to-cyber-neonCyan transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="absolute right-0 top-0 text-xs font-mono text-cyber-neonPink/70">
              {Math.round(progress)}%
            </div>
          </div>
          
          {timerEnabled && (
            <div className="flex items-center justify-center mt-3">
              <div
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-mono tracking-wider border ${
                  timeLeft <= 10 
                    ? 'border-cyber-neonPink/50 bg-cyber-neonPink/10 text-cyber-neonPink animate-pulse' 
                    : 'border-cyber-neonCyan/50 bg-cyber-neonCyan/10 text-cyber-neonCyan'
                }`}
              >
                <Clock className="h-4 w-4" />
                <span>{timeLeft}s</span>
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent className="relative z-10 p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-medium font-mono tracking-wide text-cyber-neonCyan/90 leading-relaxed mb-8 px-2">
            {currentQuestion.question}
          </h2>

          <div className="space-y-4" data-testid="options-container">
            {currentQuestion.options.map((option) => {
              let buttonClass = 'w-full p-0 overflow-hidden transition-all duration-300 font-mono tracking-wide rounded-lg group relative '
              let innerClass = 'w-full h-full px-6 py-4 text-left transition-all duration-300 relative flex items-center justify-between'
              
              if (showResult) {
                if (option === currentQuestion.correctAnswer) {
                  buttonClass += 'bg-gradient-to-r from-cyber-neonGreen/5 to-cyber-neonGreen/10 '
                  innerClass += 'text-cyber-neonGreen '
                } else if (option === selectedAnswer && option !== currentQuestion.correctAnswer) {
                  buttonClass += 'bg-gradient-to-r from-cyber-neonPink/5 to-cyber-neonPink/10 '
                  innerClass += 'text-cyber-neonPink/80 line-through '
                } else {
                  buttonClass += 'bg-cyber-darker/50 border border-cyber-neonPink/10 '
                  innerClass += 'text-cyber-neonCyan/60 '
                }
              } else if (selectedAnswer === option) {
                buttonClass += 'bg-gradient-to-r from-cyber-neonBlue/10 to-cyber-neonPurple/10 border-l-4 border-cyber-neonCyan '
                innerClass += 'text-cyber-neonCyan ml-[-4px] '
              } else {
                buttonClass += 'bg-cyber-darker/50 border border-cyber-neonPink/20 hover:border-cyber-neonCyan/40 hover:bg-cyber-neonCyan/5 '
                innerClass += 'text-cyber-neonCyan/90 '
              }

              return (
                <div 
                  key={option}
                  className={buttonClass}
                  onClick={() => !showResult && handleAnswerSelect(option)}
                >
                  <div className="absolute inset-0.5 bg-gradient-to-r from-cyber-neonPink/5 to-cyber-neonCyan/5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className={innerClass}>
                    <span className="relative z-10">{option}</span>
                    {showResult && (
                      <div className="relative z-10 ml-4 flex-shrink-0">
                        {option === currentQuestion.correctAnswer ? (
                          <CheckCircle className="h-5 w-5 text-cyber-neonGreen" />
                        ) : option === selectedAnswer ? (
                          <XCircle className="h-5 w-5 text-cyber-neonPink" />
                        ) : null}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {showResult && currentQuestion.explanation && (
            <div className="mt-8 p-5 rounded-xl border border-cyber-neonPink/20 bg-cyber-darker/60 backdrop-blur-sm">
              <div className="mt-3 p-4 bg-cyber-darkBlue/30 rounded-lg border border-cyber-neonCyan/20">
                <p className="text-sm text-cyber-neonCyan/80 font-mono tracking-wide leading-relaxed">
                  <span className="text-cyber-neonPink font-medium">[NOTE]</span> {currentQuestion.explanation}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
