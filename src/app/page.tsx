'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Home() {
    const [numPlayers, setNumPlayers] = useState(2)
    const [boardSize, setBoardSize] = useState(6)

    return (
        <main className='h-screen grid place-items-center'>
            <div className='text-center flex flex-col gap-5 w-3/5'>
                <h1 className='text-2xl semibold mb-10'>Dots and Boxes</h1>

                <p>Board Size</p>
                <input type='number' min={3} max={99} className='p-2 text-sm border rounded w-full' defaultValue={boardSize} />

                <p>Number Of Players</p>
                <input type='number' min={2} max={4} className='p-2 text-sm border rounded w-full' defaultValue={numPlayers} />

                <Link
                    href={{
                        pathname: '/play',
                        query: { boardSize },
                    }}
                    className='rounded-md px-5 py-2 bg-blue-600 text-white font-semibold mt-5 block'
                >
                    Create Game
                </Link>
            </div>
        </main>
    )
}
