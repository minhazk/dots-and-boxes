'use client'

import React, { ReactNode } from 'react'
import { GameProvider } from '../../context/GameContext'

export default function Layout({ children }: { children: ReactNode }) {
    return <GameProvider>{children}</GameProvider>
}
