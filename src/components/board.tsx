'use client'

import React from 'react'
import { useEffect, useState } from 'react'

type Line = {
    id: number
    type: 'line'
    dir: 'horizontal' | 'vertical'
    row: number
    col: number
    colouredBy: null | number
    isHovered: boolean
}

type Box = {
    id: number
    type: 'box'
    row: number
    col: number
    colouredBy: null | number
}

type BoardEl = Line | Box

type Board = BoardEl[][]

function isLine(el: BoardEl): el is Line {
    return el.type === 'line'
}

export function Board({ size }: { size: number }) {
    const [board, setBoard] = useState<Board>()

    const players = [
        { id: 0, name: 'Player 1', colour: 'red' },
        { id: 1, name: 'Player 2', colour: 'blue' },
        { id: 2, name: 'Player 3', colour: 'green' },
    ]
    const [currentPlayer, setCurrentPlayer] = useState(players[0])
    const gridSize = size * 2 + 1
    const lineThickness = '12px'

    function genBoard() {
        const grid: Board = Array.from({ length: gridSize }, () => Array(gridSize).fill(null) as BoardEl[])
        for (let row = 0; row < gridSize; row++) {
            let cols = gridSize
            if (row % 2 === 0) {
                cols = size
            }
            for (let col = 0; col < cols; col++) {
                if (row % 2 === 0) {
                    grid[row][col] = { id: row + col, type: 'line', dir: 'horizontal', row, col, colouredBy: null, isHovered: false }
                } else {
                    if (col % 2 === 0) {
                        grid[row][col] = { id: row + col, type: 'line', dir: 'vertical', row, col, colouredBy: null, isHovered: false }
                    } else {
                        grid[row][col] = { id: row + col, type: 'box', row, col, colouredBy: null }
                    }
                }
            }
        }

        setBoard(grid)
    }

    function getElData(el: EventTarget) {
        const line = el as HTMLDivElement
        const row = Number(line.getAttribute('data-row'))
        const col = Number(line.getAttribute('data-col'))
        const type = line.getAttribute('data-type')
        return { row, col, type }
    }

    function handleLineClick(e: React.MouseEvent<HTMLDivElement>) {
        if (!board) return
        const { row, col, type } = getElData(e.target)
        if (board[row][col].colouredBy !== null) return
        const newBoard = [...board]
        newBoard[row][col].colouredBy = currentPlayer.id
        ;(newBoard[row][col] as Line).isHovered = false
        setBoard(newBoard)
        setCurrentPlayer(prev => players[(prev.id + 1) % players.length])
    }

    function handleLineHoverEnter(e: React.MouseEvent<HTMLDivElement>) {
        if (!board) return
        const { row, col } = getElData(e.target)
        if (board[row][col].colouredBy !== null) return
        const newBoard = [...board]
        ;(newBoard[row][col] as Line).isHovered = true
        setBoard(newBoard)
    }

    function handleLineHoverLeave(e: React.MouseEvent<HTMLDivElement>) {
        if (!board) return
        const { row, col } = getElData(e.target)
        if (board[row][col].colouredBy !== null) return
        const newBoard = [...board]
        ;(newBoard[row][col] as Line).isHovered = false
        setBoard(newBoard)
    }

    return (
        <div>
            <h1 className='text-lg mb-4 text-center'>{currentPlayer.name}&apos;s turn</h1>
            <div className='border p-12 w-[70vmin]'>
                <div>
                    {!!board &&
                        board.map((row, i) => (
                            <div key={row[0].id} className='grid' style={{ gridTemplateColumns: `repeat(${size}, ${lineThickness} 1fr) ${lineThickness}` }}>
                                {row.map((col: Line | Box) => {
                                    return i % 2 === 0 && !col ? null : (
                                        <>
                                            <React.Fragment key={col.id}>
                                                {i % 2 === 0 && col.col < size ? <div className='filler-ball self-center' /> : null}
                                                <div
                                                    data-type={col.type}
                                                    data-row={col.row}
                                                    data-col={col.col}
                                                    onClick={isLine(col) ? handleLineClick : () => undefined}
                                                    className={`${col.type} ${isLine(col) ? col.dir : ''}`}
                                                    style={{
                                                        backgroundColor: col.colouredBy === null ? (isLine(col) && col.isHovered ? currentPlayer.colour : 'white') : players[col.colouredBy].colour,
                                                        opacity: isLine(col) && col.isHovered ? 0.15 : 1,
                                                    }}
                                                    onMouseEnter={isLine(col) ? handleLineHoverEnter : () => undefined}
                                                    onMouseLeave={isLine(col) ? handleLineHoverLeave : () => undefined}
                                                />
                                            </React.Fragment>
                                        </>
                                    )
                                })}
                                {i % 2 === 0 ? <div className='filler-ball self-center' /> : null}
                            </div>
                        ))}
                </div>
            </div>
            <button onClick={genBoard}>Create board</button>
        </div>
    )
}
