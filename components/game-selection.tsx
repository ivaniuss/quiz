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
import { Particles } from "@/components/Particles"

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
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      <div className="relative mb-16 p-8 rounded-2xl bg-gradient-to-br from-cyber-darkPurple/80 to-cyber-darkBlue/80 border border-cyber-neonPink/30 shadow-2xl shadow-cyber-neonPurple/10 backdrop-blur-sm overflow-hidden">
        {/* Efecto de brillo sutil */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#ff2a6d10_0%,transparent_70%)] animate-pulse"></div>
        
        <div className="relative z-10 text-center">
          <h2 className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyber-neonPink via-cyber-neonPurple to-cyber-neonCyan mb-6 font-mono tracking-tighter">
            CHOOSE YOUR CHALLENGE
          </h2>
          <p className="text-cyber-neonCyan/90 text-xl md:text-2xl font-medium tracking-wide">
            SELECT A GAME MODE AND TEST YOUR KNOWLEDGE!
          </p>
          
          {/* Efecto de línea decorativa */}
          <div className="mt-6 mx-auto h-1 w-32 bg-gradient-to-r from-cyber-neonPink/0 via-cyber-neonPink to-cyber-neonPink/0 rounded-full"></div>
        </div>
      </div>

      {/* Timer Settings */}
      <div className="relative mb-16 group">
        {/* Efecto de borde brillante */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyber-neonPink/10 via-cyber-neonPurple/10 to-cyber-neonCyan/10 rounded-2xl blur-sm group-hover:blur-md transition-all duration-500"></div>
        
        <Card className="relative bg-gradient-to-br from-cyber-darkPurple/80 to-cyber-darkBlue/80 border border-cyber-neonPink/20 shadow-2xl shadow-cyber-neonPurple/5 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-cyber-neonPink/40">
          <CardHeader className="border-b border-cyber-neonPink/10 pb-4 relative">
            {/* Efecto de línea inferior */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-cyber-neonPink/0 via-cyber-neonPink/40 to-cyber-neonPink/0"></div>
            
            <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyber-neonPink via-cyber-neonPurple to-cyber-neonCyan flex items-center gap-3 font-mono tracking-tight">
              <div className="p-2 rounded-lg bg-gradient-to-br from-cyber-neonPink/20 to-cyber-neonCyan/20 border border-cyber-neonPink/30 shadow-lg shadow-cyber-neonPink/10">
                <Clock className="h-6 w-6 text-cyber-neonCyan" />
              </div>
              <span className="text-shadow-neon">TIMER SETTINGS</span>
              <span className="text-cyber-neonPink/60 text-sm font-normal ml-2">(OPTIONAL)</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-6 pt-4">
            <div className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-cyber-darkPurple/50 to-cyber-darkBlue/50 border border-cyber-neonPink/10 mb-6 transition-all duration-300 hover:border-cyber-neonPink/30 hover:shadow-lg hover:shadow-cyber-neonPink/5">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Label 
                    htmlFor="timer-toggle" 
                    className="text-base font-semibold text-cyber-neonCyan flex items-center cursor-pointer"
                  >
                    {timerEnabled ? (
                      <span className="flex items-center">
                        <span className="w-2.5 h-2.5 rounded-full bg-cyber-neonGreen mr-2.5 animate-pulse"></span>
                        <span className="text-shadow-neon text-cyber-neonGreen">TIMER ENABLED</span>
                      </span>
                    ) : (
                      <span className="text-cyber-neonCyan/80">ENABLE TIMER</span>
                    )}
                  </Label>
                </div>
                <p className="text-sm text-cyber-neonCyan/70 font-medium">
                  {timerEnabled 
                    ? 'Time pressure is ON - answer quickly!' 
                    : 'Add time pressure to make it more challenging!'}
                </p>
              </div>
              
              <Switch 
                id="timer-toggle"
                checked={timerEnabled}
                onCheckedChange={setTimerEnabled}
                className={`relative h-7 w-14 rounded-full border-2 transition-all duration-300 ${
                  timerEnabled 
                    ? 'bg-gradient-to-r from-cyber-neonGreen to-cyber-neonCyan border-cyber-neonGreen/50' 
                    : 'bg-cyber-darkBlue/50 border-cyber-neonPink/30'
                }`}
              >
                <span 
                  className={`absolute top-1/2 left-1 h-5 w-5 rounded-full bg-white transform -translate-y-1/2 transition-all duration-300 ${
                    timerEnabled ? 'translate-x-7' : 'translate-x-0'
                  }`}
                />
              </Switch>
            </div>

            {timerEnabled && (
              <div className="space-y-4 p-6 rounded-xl bg-gradient-to-r from-cyber-darkPurple/50 to-cyber-darkBlue/50 border border-cyber-neonPink/10 transition-all duration-300 hover:border-cyber-neonPink/30 hover:shadow-lg hover:shadow-cyber-neonPurple/5">
                <Label htmlFor="timer-duration" className="text-sm font-semibold text-cyber-neonCyan flex items-center gap-2">
                  <span>⏱️</span>
                  <span>TIME PER QUESTION</span>
                </Label>
                
                <Select
                  value={timerSeconds.toString()}
                  onValueChange={(value) => setTimerSeconds(Number.parseInt(value))}
                >
                  <SelectTrigger className="w-full bg-cyber-darker/80 border-cyber-neonPink/20 text-cyber-neonCyan hover:border-cyber-neonPink/40 focus:ring-2 focus:ring-cyber-neonPink/30 transition-all duration-300 h-12">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  
                  <SelectContent className="bg-cyber-darker/95 border border-cyber-neonPink/20 backdrop-blur-sm shadow-2xl shadow-cyber-neonPurple/10">
                    {[5, 10, 15, 30, 45, 60].map((seconds) => (
                      <SelectItem 
                        key={seconds} 
                        value={seconds.toString()}
                        className={`relative px-4 py-2.5 text-cyber-neonCyan/90 hover:text-cyber-neonCyan focus:text-cyber-neonCyan focus:bg-cyber-neonPink/10 focus:outline-none transition-all duration-200 ${
                          timerSeconds === seconds 
                            ? 'bg-cyber-neonPink/20 text-cyber-neonCyan font-semibold border-l-2 border-cyber-neonPink' 
                            : 'hover:bg-cyber-neonPink/5 hover:border-l-2 hover:border-cyber-neonPink/30'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span>{seconds} seconds</span>
                          {timerSeconds === seconds && (
                            <span className="text-cyber-neonPink">✓</span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <div className="pt-2">
                  <div className="h-1 bg-cyber-darker/50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyber-neonPink to-cyber-neonCyan transition-all duration-500"
                      style={{ width: `${(timerSeconds / 60) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-cyber-neonCyan/60 mt-1 px-1">
                    <span>5s</span>
                    <span>30s</span>
                    <span>60s</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Game Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 relative">
        {/* Efecto de partículas de fondo */}
        <Particles />
        
        {games.map((game) => {
          const isCompleted = hasCompletedGameToday(game.id);
          const isAvailable = game.available;
          const isActive = !isCompleted && isAvailable;

          return (
            <div key={game.id} className="relative group">
              {/* Efecto de resplandor al pasar el ratón */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${
                isCompleted 
                  ? 'from-cyber-neonPink/5 to-cyber-neonPurple/5' 
                  : 'from-cyber-neonPink/10 to-cyber-neonCyan/10'
              } opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500`}></div>
              
              <Card className={`relative overflow-hidden transition-all duration-500 ${
                isActive 
                  ? 'bg-gradient-to-br from-cyber-darkPurple/80 to-cyber-darkBlue/80 border-2 border-cyber-neonPink/20 hover:border-cyber-neonPink/40 hover:shadow-2xl hover:shadow-cyber-neonPink/10 hover:-translate-y-1' 
                  : isCompleted 
                    ? 'bg-gradient-to-br from-cyber-darkPurple/60 to-cyber-darkBlue/60 border-2 border-cyber-neonPink/10' 
                    : 'bg-gradient-to-br from-cyber-darker/80 to-cyber-darkPurple/60 border-2 border-cyber-darker/30 opacity-60'
              } backdrop-blur-sm`}>
                {/* Línea superior con gradiente */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
                  isCompleted 
                    ? 'from-cyber-neonPink via-cyber-neonPurple to-cyber-neonPink' 
                    : isAvailable 
                      ? 'from-cyber-neonPink via-cyber-neonCyan to-cyber-neonGreen' 
                      : 'from-gray-600 via-gray-500 to-gray-600'
                }`}></div>

                <CardHeader className="pb-4 relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${
                      isCompleted 
                        ? 'bg-gradient-to-br from-cyber-neonPink/20 to-cyber-neonPurple/20 border border-cyber-neonPink/30' 
                        : isAvailable 
                          ? 'bg-gradient-to-br from-cyber-neonPink/20 to-cyber-neonCyan/20 border border-cyber-neonPink/30' 
                          : 'bg-cyber-darker/50 border border-cyber-darkPurple/50'
                    } shadow-lg ${isActive ? 'shadow-cyber-neonPink/20' : ''} transition-all duration-300`}>
                      {getGameIcon(game)}
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      {isCompleted && (
                        <Badge className="bg-cyber-neonPink/10 text-cyber-neonPink border border-cyber-neonPink/30 backdrop-blur-sm">
                          <CheckCircle className="h-3 w-3 mr-1.5 text-cyber-neonPink" />
                          COMPLETED
                        </Badge>
                      )}
                      {!isAvailable && (
                        <Badge className="bg-cyber-darker/80 text-cyber-neonCyan/60 border border-cyber-neonCyan/20 backdrop-blur-sm">
                          <Lock className="h-3 w-3 mr-1.5 text-cyber-neonCyan/60" />
                          COMING SOON
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <CardTitle className={`text-2xl font-bold bg-clip-text text-transparent ${
                    isCompleted 
                      ? 'bg-gradient-to-r from-cyber-neonPink to-cyber-neonPurple' 
                      : isAvailable 
                        ? 'bg-gradient-to-r from-cyber-neonCyan to-cyber-neonGreen' 
                        : 'text-cyber-neonCyan/60'
                  } font-mono tracking-tight`}>
                    {game.name.toUpperCase()}
                  </CardTitle>
                </CardHeader>

                <CardContent className="pt-0">
                  <p className={`text-sm leading-relaxed mb-6 ${
                    isCompleted 
                      ? 'text-cyber-neonPink/80' 
                      : isAvailable 
                        ? 'text-cyber-neonCyan/80' 
                        : 'text-cyber-neonCyan/50'
                  }`}>
                    {game.description}
                  </p>

                  <Button
                    onClick={() => {
                      if (isCompleted || !isAvailable) return;
                      const queryParams = new URLSearchParams();
                      if (timerEnabled) {
                        queryParams.append('timer', 'true');
                        queryParams.append('seconds', timerSeconds.toString());
                      }
                      router.push(`/games/${game.id}?${queryParams.toString()}`);
                    }}
                    disabled={isCompleted || !isAvailable}
                    className={`w-full relative overflow-hidden group/button transition-all duration-500 ${
                      isCompleted
                        ? 'bg-cyber-neonPink/10 text-cyber-neonPink border border-cyber-neonPink/30 hover:bg-cyber-neonPink/20 hover:border-cyber-neonPink/50'
                        : isAvailable
                          ? 'bg-gradient-to-r from-cyber-neonPink to-cyber-neonCyan text-cyber-darker font-bold hover:shadow-lg hover:shadow-cyber-neonPink/30 hover:brightness-110 transform hover:-translate-y-0.5'
                          : 'bg-cyber-darker/50 text-cyber-neonCyan/40 border border-cyber-darker/50 cursor-not-allowed'
                    }`}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isCompleted ? (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          COMPLETED TODAY
                        </>
                      ) : isAvailable ? (
                        <>
                          <span className="group-hover/button:animate-pulse">▶</span>
                          PLAY NOW
                        </>
                      ) : (
                        'COMING SOON'
                      )}
                    </span>
                    
                    {/* Efecto de brillo al pasar el ratón */}
                    {isAvailable && !isCompleted && (
                      <span className="absolute inset-0 bg-white/20 opacity-0 group-hover/button:opacity-100 transition-opacity duration-300 -translate-x-full group-hover/button:translate-x-full"></span>
                    )}
                  </Button>
                </CardContent>
                
                {/* Efecto de esquina decorativa */}
                <div className={`absolute bottom-3 right-3 w-3 h-3 border-r-2 border-b-2 ${
                  isCompleted 
                    ? 'border-cyber-neonPink' 
                    : isAvailable 
                      ? 'border-cyber-neonCyan' 
                      : 'border-cyber-neonCyan/30'
                } transition-all duration-300`}></div>
              </Card>
            </div>
          );
        })}
      </div>

      <div className="mt-16 text-center p-5 border border-cyan-400/10 rounded-xl bg-gradient-to-r from-cyan-900/10 via-purple-900/10 to-pink-900/10 backdrop-blur-sm">
        <p className="text-sm text-cyan-300/90 font-mono tracking-wide">
          <span className="inline-block mr-2 text-cyan-400">💡</span> 
          EACH GAME CAN ONLY BE PLAYED ONCE PER DAY. CHOOSE WISELY!
        </p>
      </div>
    </div>
  )
}
