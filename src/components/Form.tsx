'use client'

import React from 'react'
import Link from 'next/link'
import { GameProvider, useGame } from '../context/GameContext'
import { uuid } from 'uuidv4'

export function Form() {
    const { setBoardSize, boardSize } = useGame()

    return (
        <GameProvider>
            <div className='text-center flex flex-col gap-5 w-3/5'>
                <h1 className='text-2xl semibold mb-10'>Dots and Boxes</h1>

                <p>Board Size</p>
                <input onChange={e => setBoardSize(Number(e.target.value))} type='number' min={3} max={99} className='p-2 text-sm border rounded w-full' defaultValue={boardSize} />

                <Link
                    href={{
                        pathname: '/play',
                        query: { gameId: uuid() },
                    }}
                    className='rounded-md px-5 py-2 bg-blue-600 text-white font-semibold mt-5 block'
                >
                    Create Game
                </Link>

                <Link
                    href={{
                        pathname: '/play',
                        query: { id: uuid() },
                    }}
                    className='rounded-md px-5 py-2 bg-green-600 text-white font-semibold mt-5 block'
                >
                    Join Game
                </Link>
            </div>
        </GameProvider>
    )
}
