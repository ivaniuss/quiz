"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, CheckCircle, Lock } from "lucide-react"
import { getAvailableGames, hasCompletedGameToday } from "@/lib/game-utils"
import type { GameType } from "@/lib/types"

export function GameSelection() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [timerEnabled, setTimerEnabled] = useState(false)
  const [timerSeconds, setTimerSeconds] = useState(30)
  const [games, setGames] = useState<GameType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Load settings from localStorage on component mount
  useEffect(() => {
    // This code runs only on the client side
    setIsClient(true)
    
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('quizTimerSettings')
    if (savedSettings) {
      const { enabled, seconds } = JSON.parse(savedSettings)
      setTimerEnabled(enabled)
      setTimerSeconds(seconds)
    }
    
    setGames(getAvailableGames())
    setIsLoading(false)
  }, [])
  
  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (!isClient) return;
    
    localStorage.setItem('quizTimerSettings', JSON.stringify({
      enabled: timerEnabled,
      seconds: timerSeconds
    }))
  }, [isClient, timerEnabled, timerSeconds])

  const getGameIcon = (game: GameType) => {
    const IconComponent = game.iconComponent;
    return <IconComponent className="h-8 w-8" />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Choose Your Challenge</h2>
        <p className="text-gray-600">Select a game mode and test your football knowledge!</p>
      </div>

      {/* Timer Settings */}
      <Card className="mb-8 border-2 border-orange-100">
        <CardHeader className="bg-orange-50">
          <CardTitle className="text-lg text-orange-700 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Timer Settings (Optional)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-1">
              <Label htmlFor="timer-toggle" className="text-base font-medium">
                Enable Question Timer
              </Label>
              <p className="text-sm text-gray-600">Add time pressure to make it more challenging!</p>
            </div>
            <Switch id="timer-toggle" checked={timerEnabled} onCheckedChange={setTimerEnabled} />
          </div>

          {timerEnabled && (
            <div className="space-y-2">
              <Label htmlFor="timer-duration" className="text-sm font-medium">
                Time per question
              </Label>
              <Select
                value={timerSeconds.toString()}
                onValueChange={(value) => setTimerSeconds(Number.parseInt(value))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 seconds</SelectItem>
                  <SelectItem value="30">30 seconds</SelectItem>
                  <SelectItem value="45">45 seconds</SelectItem>
                  <SelectItem value="60">60 seconds</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Game Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => {
          const isCompleted = hasCompletedGameToday(game.id)
          const isAvailable = game.available

          return (
            <Card
              key={game.id}
              className={`relative overflow-hidden transition-all duration-200 ${
                isCompleted
                  ? `border-2 ${game.colors.primary.replace('bg-', 'border-')} ${game.colors.secondary.replace('text-', 'bg-opacity-10 ').split(' ')[0]}`
                  : isAvailable
                    ? `border-2 border-gray-200 hover:${game.colors.primary.replace('bg-', 'border-')} hover:shadow-lg cursor-pointer`
                    : "border-2 border-gray-100 bg-gray-50 opacity-60"
              }`}
            >
              <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${game.colors.gradient}`} />

              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${game.colors.gradient} text-white`}>
                    {getGameIcon(game)}
                  </div>
                  <div className="flex flex-col gap-2">
                    {isCompleted && (
                      <Badge variant="secondary" className={game.colors.secondary}>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Completed
                      </Badge>
                    )}
                    {!isAvailable && (
                      <Badge variant="secondary" className="bg-gray-100 text-gray-600 border-gray-200">
                        <Lock className="h-3 w-3 mr-1" />
                        Coming Soon
                      </Badge>
                    )}
                  </div>
                </div>
                <CardTitle className="text-xl">{game.name}</CardTitle>
              </CardHeader>

              <CardContent className="pt-0">
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">{game.description}</p>

                <Button
                  onClick={() => {
                    if (isCompleted || !isAvailable) return;
                    // Navigate to the game page with timer settings as query params
                    const queryParams = new URLSearchParams();
                    if (timerEnabled) {
                      queryParams.append('timer', 'true');
                      queryParams.append('seconds', timerSeconds.toString());
                    }
                    router.push(`/games/${game.id}?${queryParams.toString()}`);
                  }}
                  disabled={isCompleted || !isAvailable}
                  className={`w-full ${
                    isCompleted
                      ? game.colors.secondary + " hover:bg-opacity-80"
                      : isAvailable
                        ? `bg-gradient-to-r ${game.colors.gradient} hover:opacity-90 text-white`
                        : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {isCompleted ? "Completed" : isAvailable ? "Play Now" : "Coming Soon"}
                </Button>

                {isCompleted && (
                  <p className={`text-xs ${game.colors.primary.replace('bg-', 'text-')} text-center mt-2`}>
                    Come back tomorrow for a new challenge!
                  </p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">💡 Tip: Each game can only be played once per day. Choose wisely!</p>
      </div>
    </div>
  )
}
