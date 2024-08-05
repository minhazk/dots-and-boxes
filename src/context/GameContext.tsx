import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react'
import { socket as io } from '../socket'

type GameContextTypes = {
    gameId: string
    setGameId: React.Dispatch<React.SetStateAction<string>>
    isConnected: boolean
    boardSize: number
    setBoardSize: React.Dispatch<React.SetStateAction<number>>
}

const GameContext = createContext<GameContextTypes | undefined>(undefined)

export const useGame = (): GameContextTypes => {
    const context = useContext(GameContext)
    if (!context) {
        throw new Error('useGame must be used within a GameProvider')
    }
    return context
}

export const GameProvider = ({ children }: { children: ReactNode }) => {
    const [gameId, setGameId] = useState('')
    const [isConnected, setIsConnected] = useState(false)
    const [boardSize, setBoardSize] = useState(6)

    useEffect(() => {
        io.connect()
        io.on('connect', () => {
            setIsConnected(true)
            console.log('socket connected')
        })

        io.on('disconnect', () => {
            setIsConnected(false)
        })

        return () => {
            io.disconnect()
        }
    }, [])

    return <GameContext.Provider value={{ gameId, setGameId, isConnected, boardSize, setBoardSize }}>{children}</GameContext.Provider>
}
