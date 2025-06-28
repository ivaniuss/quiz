import type { Quiz, CompletionData, GameType } from "./types"

// Available game types
const AVAILABLE_GAMES: GameType[] = [
  {
    id: "daily-trivia",
    name: "Daily Trivia",
    description:
      "Test your general football knowledge with 10 challenging questions covering all aspects of the beautiful game.",
    route: "/daily-trivia",
    icon: "trophy",
    available: true,
  },
  {
    id: "player-guess",
    name: "Player Guess",
    description:
      "Can you identify famous football players from clues about their career, achievements, and playing style?",
    route: "/player-guess",
    icon: "users",
    available: true,
  },
  {
    id: "club-quiz",
    name: "Club Quiz",
    description:
      "How well do you know football clubs? Test your knowledge of team history, stadiums, and achievements.",
    route: "/club-quiz",
    icon: "target",
    available: false, // Coming soon
  },
]

// Static quiz data - in the future this could come from an API
const QUIZ_DATA: Quiz[] = [
  {
    id: "daily-2024-01-01",
    date: "2024-01-01",
    title: "New Year Football Quiz",
    questions: [
      {
        id: "q1",
        question: "Which country won the FIFA World Cup in 2022?",
        options: ["Brazil", "Argentina", "France", "Germany"],
        correctAnswer: "Argentina",
        explanation:
          "Argentina won the 2022 FIFA World Cup in Qatar, with Lionel Messi finally achieving his World Cup dream.",
        difficulty: "easy",
        category: "World Cup",
      },
      {
        id: "q2",
        question: "Who is the all-time top scorer in UEFA Champions League history?",
        options: ["Lionel Messi", "Cristiano Ronaldo", "Robert Lewandowski", "Karim Benzema"],
        correctAnswer: "Cristiano Ronaldo",
        explanation: "Cristiano Ronaldo holds the record with over 140 goals in the Champions League.",
        difficulty: "medium",
        category: "Champions League",
      },
      {
        id: "q3",
        question: "Which club has won the most Premier League titles?",
        options: ["Liverpool", "Arsenal", "Chelsea", "Manchester United"],
        correctAnswer: "Manchester United",
        explanation: "Manchester United has won 13 Premier League titles since its inception in 1992.",
        difficulty: "medium",
        category: "Premier League",
      },
      {
        id: "q4",
        question: "In which year was the first FIFA World Cup held?",
        options: ["1928", "1930", "1932", "1934"],
        correctAnswer: "1930",
        explanation: "The first FIFA World Cup was held in Uruguay in 1930.",
        difficulty: "hard",
        category: "World Cup",
      },
      {
        id: "q5",
        question: "Which player has won the most Ballon d'Or awards?",
        options: ["Cristiano Ronaldo", "Lionel Messi", "Michel Platini", "Johan Cruyff"],
        correctAnswer: "Lionel Messi",
        explanation: "Lionel Messi has won the Ballon d'Or 8 times, more than any other player.",
        difficulty: "easy",
        category: "Awards",
      },
      {
        id: "q6",
        question: "Which country hosted the 2018 FIFA World Cup?",
        options: ["Brazil", "Germany", "Russia", "Qatar"],
        correctAnswer: "Russia",
        explanation: "The 2018 FIFA World Cup was held in Russia across 11 cities.",
        difficulty: "easy",
        category: "World Cup",
      },
      {
        id: "q7",
        question: "What is the maximum number of players a team can have on the field during a match?",
        options: ["10", "11", "12", "13"],
        correctAnswer: "11",
        explanation: "Each team can have a maximum of 11 players on the field, including the goalkeeper.",
        difficulty: "easy",
        category: "Rules",
      },
      {
        id: "q8",
        question: 'Which club is known as "The Red Devils"?',
        options: ["Liverpool", "Arsenal", "Manchester United", "AC Milan"],
        correctAnswer: "Manchester United",
        explanation: 'Manchester United is nicknamed "The Red Devils" due to their red jerseys.',
        difficulty: "medium",
        category: "Club Nicknames",
      },
      {
        id: "q9",
        question: 'Who scored the "Hand of God" goal?',
        options: ["Pelé", "Diego Maradona", "Ronaldinho", "Zinedine Zidane"],
        correctAnswer: "Diego Maradona",
        explanation: 'Diego Maradona scored the infamous "Hand of God" goal against England in the 1986 World Cup.',
        difficulty: "medium",
        category: "Historic Moments",
      },
      {
        id: "q10",
        question: 'Which stadium is known as "The Theatre of Dreams"?',
        options: ["Wembley Stadium", "Old Trafford", "Anfield", "Emirates Stadium"],
        correctAnswer: "Old Trafford",
        explanation: 'Old Trafford, Manchester United\'s home stadium, is famously known as "The Theatre of Dreams".',
        difficulty: "medium",
        category: "Stadiums",
      },
    ],
  },
]

const PLAYER_GUESS_QUIZ: Quiz = {
  id: "player-guess-daily",
  date: getTodayDateString(),
  title: "Daily Player Guess",
  questions: [
    {
      id: "p1",
      question:
        "This Argentine forward has won 8 Ballon d'Or awards and spent most of his career at Barcelona before moving to PSG and then Inter Miami.",
      options: ["Cristiano Ronaldo", "Lionel Messi", "Diego Maradona", "Sergio Agüero"],
      correctAnswer: "Lionel Messi",
      explanation: "Lionel Messi is widely considered one of the greatest players of all time.",
      difficulty: "easy",
      category: "Players",
    },
    // Add more player questions...
  ],
}

// Get today's date in YYYY-MM-DD format
function getTodayDateString(): string {
  return new Date().toISOString().split("T")[0]
}

// Generate a quiz ID for today
function getTodayQuizId(): string {
  return `daily-${getTodayDateString()}`
}

export function getAvailableGames(): GameType[] {
  return AVAILABLE_GAMES
}

export function getGameQuiz(gameId: string): Quiz {
  const today = new Date()
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24),
  )

  switch (gameId) {
    case "daily-trivia":
      const triviaIndex = dayOfYear % QUIZ_DATA.length
      const baseTrivia = QUIZ_DATA[triviaIndex]
      return {
        ...baseTrivia,
        id: `${gameId}-${getTodayDateString()}`,
        date: getTodayDateString(),
      }

    case "player-guess":
      return {
        ...PLAYER_GUESS_QUIZ,
        id: `${gameId}-${getTodayDateString()}`,
        date: getTodayDateString(),
      }

    default:
      return getGameQuiz("daily-trivia")
  }
}

export function hasCompletedGameToday(gameId: string): boolean {
  const completion = localStorage.getItem(`futquiz_completion_${gameId}`)
  if (!completion) return false

  try {
    const data: CompletionData = JSON.parse(completion)
    return data.date === new Date().toDateString()
  } catch {
    return false
  }
}

export function markGameCompleted(gameId: string, completionData: CompletionData): void {
  localStorage.setItem(`futquiz_completion_${gameId}`, JSON.stringify(completionData))
}

export function getTodayGameCompletionData(gameId: string): CompletionData | null {
  const completion = localStorage.getItem(`futquiz_completion_${gameId}`)
  if (!completion) return null

  try {
    const data: CompletionData = JSON.parse(completion)
    if (data.date === new Date().toDateString()) {
      return data
    }
    return null
  } catch {
    return null
  }
}

// Future: This could be replaced with API calls
export async function fetchTodaysQuiz(): Promise<Quiz> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getGameQuiz("daily-trivia"))
    }, 500)
  })
}
