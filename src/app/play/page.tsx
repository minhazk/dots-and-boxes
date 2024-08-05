'use client'

import { Board } from '@/components/board'
import { useSearchParams } from 'next/navigation'

export default function Page() {
    const searchParams = useSearchParams()
    const boardSize = searchParams.get('boardSize')

    return (
        <main className='h-screen grid place-items-center'>
            <Board size={Number(boardSize)} />
        </main>
    )
}
