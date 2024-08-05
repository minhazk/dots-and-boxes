'use client'

import { Board } from '@/components/Board'
import { GameProvider, useGame } from '@/context/GameContext'
import { useSearchParams } from 'next/navigation'

export default function Page() {
    const { boardSize, setGameId } = useGame()
    const searchParams = useSearchParams()

    const gameId = searchParams.get('gameId')
    if (!gameId) return
    setGameId(gameId)

    return (
        <GameProvider>
            <main>
                <p className='mt-5 text-sm text-center'>Game ID: {gameId}</p>
                <div className='h-screen grid place-items-center'>
                    <Board size={Number(boardSize)} />
                </div>
            </main>
        </GameProvider>
    )
}
