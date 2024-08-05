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

type Filler = {
    id: number
    type: 'filler-ball'
    row: number
    col: number
    colouredBy: null | number
}

type BoardEl = Line | Box | Filler

type Board = BoardEl[][]

function isLine(el: BoardEl): el is Line {
    return el.type === 'line'
}

export function Board({ size }: { size: number }) {
    const [board, setBoard] = useState<Board>()

    useEffect(() => {
        genBoard()
    }, [])

    const players = [
        { id: 0, name: 'Player 1', colour: 'red', score: 0 },
        { id: 1, name: 'Player 2', colour: 'blue', score: 0 },
        // { id: 2, name: 'Player 3', colour: 'green', score: 0 },
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
            for (let col = 0; col < gridSize; col++) {
                if (row % 2 === 0) {
                    if (col % 2 !== 0) {
                        grid[row][col] = { id: row + col, type: 'line', dir: 'horizontal', row, col, colouredBy: null, isHovered: false }
                    } else grid[row][col] = { id: row + col, type: 'filler-ball', row, col, colouredBy: null }
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
        const dir = line.getAttribute('data-dir')
        return { row, col, type, dir }
    }

    function handleLineClick(e: React.MouseEvent<HTMLDivElement>) {
        if (!board) return
        const { row, col, dir } = getElData(e.target)
        if (board[row][col].colouredBy !== null) return
        const newBoard = [...board]
        newBoard[row][col].colouredBy = currentPlayer.id
        ;(newBoard[row][col] as Line).isHovered = false
        setBoard(newBoard)
        const boxes = checkBoxes(row, col, dir!)
        if (boxes !== undefined && boxes.length !== 0) {
            for (let box of boxes) {
                newBoard[box!.row][box!.col].colouredBy = currentPlayer.id
            }
        }
        setCurrentPlayer(prev => players[(prev.id + 1) % players.length])
    }

    function getBoxOutlines(row: number, col: number) {
        if (!board) return
        const leftLine = board[row][col - 1]
        const rightLine = board[row][col + 1]
        const topLine = board[row - 1][col]
        const bottomLine = board[row + 1][col]

        return [leftLine, rightLine, topLine, bottomLine]
    }

    function isBoxOwner(box: BoardEl | undefined) {
        if (box === undefined) return false
        const lines = getBoxOutlines(box.row, box.col)!
        return lines.every(line => line.colouredBy !== null)
    }

    function checkBoxes(row: number, col: number, dir: string) {
        if (!board) return
        let box1: BoardEl | undefined, box2: BoardEl | undefined

        if (dir === 'vertical') {
            if (col - 1 >= 0) {
                box1 = board[row][col - 1]
            }
            if (col + 1 < board[0].length) {
                box2 = board[row][col + 1]
            }
        } else {
            if (row - 1 >= 0) {
                box1 = board[row - 1][col]
            }
            if (row + 1 < board.length) {
                box2 = board[row + 1][col]
            }
        }

        const boxes = []
        if (isBoxOwner(box1)) boxes.push(box1)
        if (isBoxOwner(box2)) boxes.push(box2)
        return boxes
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
            <div className='border p-16 w-[70vmin]'>
                <div>
                    {!!board &&
                        board.map((row, i) => (
                            <div key={i} className='grid' style={{ gridTemplateColumns: `repeat(${size}, ${lineThickness} 1fr) ${lineThickness}` }}>
                                {row.map((col: Line | Box | Filler) => {
                                    return (
                                        <>
                                            <React.Fragment key={col.id}>
                                                {col.type === 'filler-ball' ? (
                                                    <div className='filler-ball self-center' />
                                                ) : (
                                                    <div
                                                        data-type={col.type}
                                                        data-dir={isLine(col) ? col.dir : null}
                                                        data-row={col.row}
                                                        data-col={col.col}
                                                        onClick={isLine(col) ? handleLineClick : () => undefined}
                                                        className={`${col.type} ${isLine(col) ? col.dir : 'm-[1px]'}`}
                                                        style={{
                                                            backgroundColor: col.colouredBy === null ? (isLine(col) && col.isHovered ? currentPlayer.colour : 'white') : players[col.colouredBy].colour,
                                                            opacity: isLine(col) && col.isHovered ? 0.15 : !isLine(col) ? 0.6 : 1,
                                                        }}
                                                        onMouseEnter={isLine(col) ? handleLineHoverEnter : () => undefined}
                                                        onMouseLeave={isLine(col) ? handleLineHoverLeave : () => undefined}
                                                    />
                                                )}
                                            </React.Fragment>
                                        </>
                                    )
                                })}
                            </div>
                        ))}
                </div>
            </div>
            <div className='grid mt-5' style={{ gridTemplateColumns: `repeat(${players.length},1fr` }}>
                {players.map(p => (
                    <div key={p.id} className='flex flex-col text-center text-sm gap-2'>
                        <p className='text-bold'>{p.name}</p>
                        <p>{p.score}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
