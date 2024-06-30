"use client";
import React, { useState, useEffect } from 'react';

const SingleplayerPage: React.FC = () => {
    const [board, setBoard] = useState<Array<string | null>>(Array(9).fill(null));
    const [isXNext, setIsXNext] = useState<boolean>(true);
    const [status, setStatus] = useState<string>("Next player: X");
    const [winner, setWinner] = useState<string | null>(null);
    const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
    const [isGameActive, setIsGameActive] = useState<boolean>(false);

    useEffect(() => {
        const calculatedWinner = calculateWinner(board);
        if (calculatedWinner) {
            setWinner(calculatedWinner);
            setStatus(`Winner: ${calculatedWinner}`);
            setIsGameActive(false);
        } else if (board.every(Boolean)) {
            setStatus('It\'s a draw!');
            setIsGameActive(false);
        } else {
            setStatus(`Next player: ${isXNext ? 'X' : 'O'}`);
            if (!isXNext) {
                let bestMove: number | null = null;
                if (difficulty === 'easy') {
                    bestMove = findRandomMove(board);
                } else if (difficulty === 'medium') {
                    bestMove = findMediumMove(board);
                } else if (difficulty === 'hard') {
                    bestMove = findBestMove(board);
                }
                if (bestMove !== null) {
                    handleClick(bestMove);
                }
            }
        }
    }, [board, isXNext]);

    const handleClick = (index: number) => {
        if (board[index] || winner) {
            return;
        }

        const newBoard = board.slice();
        newBoard[index] = isXNext ? 'X' : 'O';
        setBoard(newBoard);
        setIsXNext(!isXNext);
        setIsGameActive(true)
    };

    const renderSquare = (index: number) => {
        const value = board[index];
        const color = value === 'X' ? 'text-blue-500' : value === 'O' ? 'text-red-500' : 'text-black';

        return (
            <div
                key={index}
                onClick={() => handleClick(index)}
                className={`square w-24 h-24 bg-white border-2 border-black flex items-center justify-center text-4xl font-bold cursor-pointer ${color} hover:bg-gray-200 transition`}
            >
                {value}
            </div>
        );
    };

    const calculateWinner = (squares: Array<string | null>) => {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];

        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a];
            }
        }
        return null;
    };

    const findRandomMove = (board: Array<string | null>) => {
        const availableMoves = board.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    };

    const findMediumMove = (board: Array<string | null>) => {
        const winningMove = findWinningMove(board, 'O');
        if (winningMove !== null) {
            return winningMove;
        }
        const blockingMove = findWinningMove(board, 'X');
        if (blockingMove !== null) {
            return blockingMove;
        }
        return findRandomMove(board);
    };

    const findWinningMove = (board: Array<string | null>, player: string) => {
        for (let i = 0; i < board.length; i++) {
            if (!board[i]) {
                board[i] = player;
                if (calculateWinner(board) === player) {
                    board[i] = null;
                    return i;
                }
                board[i] = null;
            }
        }
        return null;
    };

    const findBestMove = (board: Array<string | null>) => {
        let bestVal = -Infinity;
        let bestMove: number | null = null;

        for (let i = 0; i < board.length; i++) {
            if (!board[i]) {
                board[i] = 'O';
                let moveVal = minimax(board, 0, false);
                board[i] = null;
                if (moveVal > bestVal) {
                    bestMove = i;
                    bestVal = moveVal;
                }
            }
        }

        return bestMove;
    };

    const minimax = (board: Array<string | null>, depth: number, isMaximizing: boolean) => {
        const winner = calculateWinner(board);
        if (winner === 'X') return -10 + depth;
        if (winner === 'O') return 10 - depth;
        if (board.every(Boolean)) return 0;

        if (isMaximizing) {
            let best = -Infinity;
            for (let i = 0; i < board.length; i++) {
                if (!board[i]) {
                    board[i] = 'O';
                    best = Math.max(best, minimax(board, depth + 1, false));
                    board[i] = null;
                }
            }
            return best;
        } else {
            let best = Infinity;
            for (let i = 0; i < board.length; i++) {
                if (!board[i]) {
                    board[i] = 'X';
                    best = Math.min(best, minimax(board, depth + 1, true));
                    board[i] = null;
                }
            }
            return best;
        }
    };

    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setIsXNext(true);
        setWinner(null);
        setStatus('Next player: X');
        setIsGameActive(false);
    };

    return (
        <>
            <div className="status mb-4 text-2xl font-bold">{status}</div>
            <div className="board flex flex-col items-center space-y-2">
                <div className="board-row flex space-x-2">
                    {renderSquare(0)}
                    {renderSquare(1)}
                    {renderSquare(2)}
                </div>
                <div className="board-row flex space-x-2">
                    {renderSquare(3)}
                    {renderSquare(4)}
                    {renderSquare(5)}
                </div>
                <div className="board-row flex space-x-2">
                    {renderSquare(6)}
                    {renderSquare(7)}
                    {renderSquare(8)}
                </div>
            </div>
            <div className="mt-4">
                {(winner || board.every(Boolean)) && (
                    <button onClick={resetGame} className="px-4 py-2 bg-blue-500 text-white rounded">
                        Play Again
                    </button>
                )}
            </div>
            <div className="mt-4 flex space-x-4">
                <button onClick={() => setDifficulty('easy')} disabled={isGameActive} className={`px-4 py-2 rounded ${difficulty === 'easy' ? 'bg-blue-700 text-white' : 'bg-gray-200 text-black'}`}>
                    Easy
                </button>
                <button onClick={() => setDifficulty('medium')} disabled={isGameActive} className={`px-4 py-2 rounded ${difficulty === 'medium' ? 'bg-blue-700 text-white' : 'bg-gray-200 text-black'}`}>
                    Medium
                </button>
                <button onClick={() => setDifficulty('hard')} disabled={isGameActive} className={`px-4 py-2 rounded ${difficulty === 'hard' ? 'bg-blue-700 text-white' : 'bg-gray-200 text-black'}`}>
                    Hard
                </button>
                <button onClick={() => resetGame()} className={`px-4 py-2 rounded bg-red-700 text-white`}>
                    Reset game
                </button>
            </div>
        </>
    );
};

export default SingleplayerPage;
