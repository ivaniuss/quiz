import type { GameType, CompletionData } from "./types";
import { Trophy, Users, Target } from "lucide-react";

// Helper function to safely access localStorage
const getLocalStorage = () => {
  if (typeof window === 'undefined') {
    return null;
  }
  return window.localStorage;
};

export function markGameCompleted(gameId: string, completion: CompletionData): void {
  const storage = getLocalStorage();
  if (!storage) return;
  
  storage.setItem(
    `futquiz_completion_${gameId}`, 
    JSON.stringify({
      ...completion,
      completedAt: new Date().toISOString(),
    })
  );
}

export function hasCompletedGameToday(gameId: string): boolean {
  const storage = getLocalStorage();
  if (!storage) return false;
  
  const completion = storage.getItem(`futquiz_completion_${gameId}`);
  if (!completion) return false;
  
  try {
    const data = JSON.parse(completion);
    if (!data.completedAt) return false;
    
    const completedDate = new Date(data.completedAt);
    const today = new Date();
    
    return (
      completedDate.getDate() === today.getDate() &&
      completedDate.getMonth() === today.getMonth() &&
      completedDate.getFullYear() === today.getFullYear()
    );
  } catch (e) {
    console.error('Error parsing completion data:', e);
    return false;
  }
}

export function getTodayGameCompletionData(gameId: string): CompletionData | null {
  const storage = getLocalStorage();
  if (!storage) return null;
  
  const completion = storage.getItem(`futquiz_completion_${gameId}`);
  if (!completion) return null;
  
  try {
    return JSON.parse(completion);
  } catch (e) {
    console.error('Error parsing completion data:', e);
    return null;
  }
}

// Lista de juegos disponibles
export const GAMES: GameType[] = [
  {
    id: "daily-trivia",
    name: "Trivia Diaria",
    description: "Pon a prueba tus conocimientos de fútbol con preguntas diarias.",
    route: "/daily-trivia",
    icon: "trophy",
    available: true,
    colors: {
      primary: "bg-emerald-700",
      secondary: "bg-emerald-900/20 text-emerald-100 border-emerald-700/50",
      gradient: "from-emerald-700 to-emerald-800"
    },
    iconComponent: Trophy
  },
  {
    id: "player-guess-quiz",
    name: "Adivina el Jugador",
    description: "¿Puedes adivinar al jugador con solo pistas sobre su carrera?",
    route: "/player-guess-quiz",
    icon: "users",
    available: true,
    colors: {
      primary: "bg-sky-700",
      secondary: "bg-sky-900/20 text-sky-100 border-sky-700/50",
      gradient: "from-sky-700 to-sky-800"
    },
    iconComponent: Users
  },
  {
    id: "club-quiz",
    name: "Adivina el Club",
    description: "¿Cuánto sabes sobre los clubes de fútbol?",
    route: "/club-quiz",
    icon: "target",
    available: false, // Coming soon
    colors: {
      primary: "bg-indigo-700",
      secondary: "bg-indigo-900/20 text-indigo-100 border-indigo-700/50",
      gradient: "from-indigo-700 to-indigo-800"
    },
    iconComponent: Target
  },
];

export function getAvailableGames(): GameType[] {
  return GAMES.filter(game => game.available);
}

export function getGameById(gameId: string): GameType | undefined {
  return GAMES.find(game => game.id === gameId);
}
