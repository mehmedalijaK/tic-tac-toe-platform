import { Server } from 'socket.io';
import axios from 'axios';

const io = new Server(4000, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const rooms = {};

io.on('connection', (socket) => {
    console.log(`New connection: ${socket.id}`);

    socket.on('createRoom', ({ roomId, username, score }) => {
        if (!rooms[roomId]) {
            rooms[roomId] = { players: [{ id: socket.id, username, score, symbol: 'X' }] };
            socket.join(roomId);
            console.log(`Room ${roomId} created by ${username}`);
        } else {
            socket.emit('createError', 'Room already exists.');
        }
    });

    socket.on('joinRoom', ({ roomId, username, score }) => {
        const room = rooms[roomId];
        if (room) {
            if (room.players.length < 2) {
                const symbol = room.players[0].symbol === 'X' ? 'O' : 'X';
                room.players.push({ id: socket.id, username, score, symbol });
                socket.join(roomId);
                console.log(`${username} joined Room ${roomId}`);

                // Notify both players to start the game
                io.to(roomId).emit('startGame', room.players);
            } else {
                socket.emit('joinError', 'Room is full.');
            }
        } else {
            socket.emit('joinError', 'Room does not exist.');
        }
    });

    socket.on('makeMove', ({ roomId, board, isXNext, status }) => {
        socket.to(roomId).emit('moveMade', { board, isXNext, status });

        // Check for game end
        const winnerSymbol = calculateWinner(board);
        if (winnerSymbol) {
            const players = rooms[roomId].players;
            const winner = players.find(player => player.symbol === winnerSymbol);
            const loser = players.find(player => player.symbol !== winnerSymbol);

            const gameResultDto = {
                usernameWinner: winner.username,
                usernameLoser: loser.username,
                localDateTime: new Date().toISOString()
            };
            
            console.log(gameResultDto);

            axios.post('http://localhost:9090/api/game/create', gameResultDto)
                .then(response => {
                    console.log('Game result sent to backend:', response.data);
                })
                .catch(error => {
                    console.error('Error sending game result to backend:', error);
                });

            // Notify players
            io.to(roomId).emit('gameFinished', { winner: winner.username, loser: loser.username });

            // Cleanup room
            delete rooms[roomId];
        }
    });

    socket.on('leaveRoom', (roomId) => {
        console.log("user left");
        const room = rooms[roomId];
        if (room) {
            room.players = room.players.filter(player => player.id !== socket.id);
            if (room.players.length === 0) {
                delete rooms[roomId];
            } else {
                socket.to(roomId).emit('opponentLeftRoom');
            }
            socket.leave(roomId);
        }
    });

    socket.on('disconnect', () => {
        console.log(`Disconnected: ${socket.id}`);
        for (const roomId in rooms) {
            const room = rooms[roomId];
            const playerIndex = room.players.findIndex(player => player.id === socket.id);
            if (playerIndex !== -1) {
                room.players.splice(playerIndex, 1);
                if (room.players.length === 0) {
                    delete rooms[roomId];
                } else {
                    io.to(roomId).emit('opponentLeftRoom');
                }
                break;
            }
        }
    });
});

// Helper function to calculate the winner
function calculateWinner(board) {
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
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return null;
}
