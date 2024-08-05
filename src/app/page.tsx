import { Board } from '@/components/board'

export default function Home() {
    return (
        <main className='h-screen grid place-items-center'>
            <Board size={5} />
        </main>
    )
}
