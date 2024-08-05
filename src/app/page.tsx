'use client'

import { GameProvider } from '@/context/GameContext'
import { Form } from '@/components/Form'

export default function Home() {
    return (
        <GameProvider>
            <main className='h-screen grid place-items-center'>
                <Form />
            </main>
        </GameProvider>
    )
}
