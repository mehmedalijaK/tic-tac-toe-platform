"use client"
import AuthContext from '@/context/AuthContext';
import React, { useState, useEffect, useContext } from 'react';
import io, { Socket } from 'socket.io-client';

const NewGamePage: React.FC = () => {
    const [board, setBoard] = useState<Array<string | null>>(Array(9).fill(null));
    const [isXNext, setIsXNext] = useState<boolean>(true);
    const [roomId, setRoomId] = useState<string | null>(null);
    const [player, setPlayer] = useState<string | null>(null);
    const [status, setStatus] = useState<string>("Create or join a room to start playing");
    const [socket, setSocket] = useState<Socket | null>(null);
    const [winner, setWinner] = useState<string | null>(null);
    const [serverOnline, setServerOnline] = useState<boolean>(false);
    const [playerInfo, setPlayerInfo] = useState<{ username: string, score: number } | null>(null);
    const [opponentInfo, setOpponentInfo] = useState<{ username: string, score: number } | null>(null);
    const {user} = useContext(AuthContext);
    const [score, setScore] = useState<number | undefined>(user?.score)

    useEffect(() => {
        const newSocket = io('http://localhost:4000');
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Connected to server');
            setServerOnline(true);
            setStatus("Create or join a room to start playing");
        });

        newSocket.on('disconnect', () => {
            console.log('Disconnected from server');
            setStatus("Disconnected from server. Please refresh the page.");
            setServerOnline(false);
        });

        newSocket.on('opponentLeftRoom', () => {
            setStatus('Opponent has disconnected. Game ended.');
            console.log("Opponent left the room");
            handleLeaveRoom();
        });

        newSocket.on('startGame', (players) => {
            setStatus("Game started! Next player: X");
            const currentPlayer = players.find(p => p.id === newSocket.id);
            const opponent = players.find(p => p.id !== newSocket.id);
            setPlayerInfo(currentPlayer);
            setOpponentInfo(opponent);
        });

        newSocket.on('moveMade', (data) => {
            setBoard(data.board);
            setIsXNext(data.isXNext);
            setStatus(data.status);
        });

        newSocket.on('createError', (message: string) => {
            setStatus(message);
            setRoomId(null);
            setPlayer(null);
        });

        newSocket.on('joinError', (message: string) => {
            setStatus(message);
            setRoomId(null);
            setPlayer(null);
        });

        newSocket.on('gameFinished', ({ winner, loser }) => {
            console.log(`Game finished! Winner: ${winner}, Loser: ${loser}`);
            console.log(winner)
            console.log(user?.username)

            // Update user scores or perform other actions based on game result
           
        });

        return () => {
            if (newSocket) {
                newSocket.disconnect();
            }
        };
    }, []);


    const createRoom = () => {
        if (!serverOnline) return;

        const newRoomId = prompt("Enter room ID to create:");
        const username = user?.username
        // const score = user?.score
        if (newRoomId && username && socket) {
            setRoomId(newRoomId);
            setPlayer("X");
            setPlayerInfo({ username, score: score || 0});
            socket.emit("createRoom", { roomId: newRoomId, username, score });
            setStatus("Room created! Waiting for another player to join...");
        }
    };

    const joinRoom = () => {
        if (!serverOnline) return;

        const joinRoomId = prompt("Enter room ID to join:");
        const username = user?.username
        // const score = user?.score
        if (joinRoomId && username && socket) {
            setRoomId(joinRoomId);
            setPlayer("O");
            setPlayerInfo({ username, score: score || 0 });
            socket.emit("joinRoom", { roomId: joinRoomId, username, score });
            setStatus("Joined room! Waiting for the first move...");
        }
    };

    const handleClick = (index: number) => {
        if (!roomId || board[index] || winner || player !== (isXNext ? 'X' : 'O') || !serverOnline) {
            return;
        }

        const newBoard = board.slice();
        newBoard[index] = isXNext ? 'X' : 'O';
        const newIsXNext = !isXNext;
        const newStatus = `Next player: ${newIsXNext ? 'X' : 'O'}`;
        setBoard(newBoard);
        setIsXNext(newIsXNext);
        setStatus(newStatus);

        socket?.emit("makeMove", { roomId, board: newBoard, isXNext: newIsXNext, status: newStatus });
    };

    const handleLeaveRoom = () => {
        console.log('leave room');
        if (roomId && socket) {
            console.log('leave room');
            socket.emit('leaveRoom', roomId); // Emit leaveRoom event to notify server
            setRoomId(null);
            setPlayer(null);
            setBoard(Array(9).fill(null));
            setIsXNext(true);
            setStatus("Create or join a room to start playing");
            setWinner(null);
            setPlayerInfo(null);
            setOpponentInfo(null);
        }
    };

    const resetGame = () => {
        setSocket(null);
        setRoomId(null);
        setPlayer(null);
        setBoard(Array(9).fill(null));
        setIsXNext(true);
        setStatus("Create or join a room to start playing");
        setWinner(null);
        setServerOnline(false); // Adjust serverOnline state if necessary
    };

    useEffect(() => {
        const calculatedWinner = calculateWinner(board);
        if (calculatedWinner) {
            setWinner(calculatedWinner);
            setStatus(`Winner: ${calculatedWinner}`);
        }
    }, [board]);

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

    return (
        <>
            <div className="status mb-4 text-2xl font-bold">{status}</div>
            {playerInfo && opponentInfo && (
                <div className="players mb-4 text-xl font-semibold">
                    <div>Player: {playerInfo.username} (Score: {playerInfo.score})</div>
                    <div>Opponent: {opponentInfo.username} (Score: {opponentInfo.score})</div>
                </div>
            )}
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
                {!roomId && (
                    <div className="flex space-x-4">
                        <button
                            onClick={createRoom}
                            disabled={!serverOnline}
                            className={`px-4 py-2 bg-blue-500 text-white rounded ${!serverOnline ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            Create Room
                        </button>
                        <button
                            onClick={joinRoom}
                            disabled={!serverOnline}
                            className={`px-4 py-2 bg-green-500 text-white rounded ${!serverOnline ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            Join Room
                        </button>
                    </div>
                )}
                {roomId && (
                    <div className="mt-4">
                        <button onClick={handleLeaveRoom} className="px-4 py-2 bg-red-500 text-white rounded">Leave Game</button>
                    </div>
                )}
            </div>
        </>
    );
};

export default NewGamePage;
