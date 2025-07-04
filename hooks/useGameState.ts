import { useCallback, useMemo, useReducer } from 'react'
import type { GameState, GameType, Quiz, CompletionData } from '@/lib/types'

type GameAction =
  | { type: 'START_LOADING' }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'SELECT_GAME'; payload: { game: GameType; timerEnabled: boolean; timerSeconds: number } }
  | { type: 'START_GAME'; payload: { quiz: Quiz } }
  | { type: 'COMPLETE_GAME'; payload: { completionData: CompletionData } }
  | { type: 'RESET_GAME' }

const initialState: GameState = {
  status: 'idle',
  error: null,
  data: {
    currentGame: null,
    currentQuiz: null,
    completionData: null,
  },
  settings: {
    timerEnabled: false,
    timerSeconds: 30,
  },
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_LOADING':
      return { ...state, status: 'loading', error: null }

    case 'SET_ERROR':
      return { ...state, status: 'error', error: action.payload }

    case 'SELECT_GAME':
      return {
        ...state,
        status: 'success',
        data: {
          ...state.data,
          currentGame: action.payload.game,
        },
        settings: {
          timerEnabled: action.payload.timerEnabled,
          timerSeconds: action.payload.timerSeconds,
        },
      }

    case 'START_GAME':
      return {
        ...state,
        status: 'success',
        data: {
          ...state.data,
          currentQuiz: action.payload.quiz,
        },
      }

    case 'COMPLETE_GAME':
      return {
        ...state,
        status: 'success',
        data: {
          ...state.data,
          completionData: action.payload.completionData,
        },
      }

    case 'RESET_GAME':
      return {
        ...initialState,
        status: 'success',
      }

    default:
      return state
  }
}

export function useGameState() {
  const [state, dispatch] = useReducer(gameReducer, initialState)

  const selectGame = useCallback((game: GameType, timerEnabled: boolean, timerSeconds: number) => {
    dispatch({
      type: 'SELECT_GAME',
      payload: { game, timerEnabled, timerSeconds },
    })
  }, [])

  const startGame = useCallback((quiz: Quiz) => {
    dispatch({
      type: 'START_GAME',
      payload: { quiz },
    })
  }, [])

  const completeGame = useCallback((completionData: CompletionData) => {
    dispatch({
      type: 'COMPLETE_GAME',
      payload: { completionData },
    })
  }, [])

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' })
  }, [])

  const setError = useCallback((error: string) => {
    dispatch({ type: 'SET_ERROR', payload: error })
  }, [])

  // Memoize actions to prevent unnecessary re-renders
  const actions = useMemo(() => ({
    selectGame,
    startGame,
    completeGame,
    resetGame,
    setError,
  }), [selectGame, startGame, completeGame, resetGame, setError])

  return {
    state,
    actions,
  }
}
