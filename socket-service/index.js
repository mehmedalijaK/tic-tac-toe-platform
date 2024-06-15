import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
    }
});

app.use(cors()); 

const rooms = {};

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('createRoom', (roomId) => {
        if (!rooms[roomId]) {
            rooms[roomId] = { players: [socket.id] };
            socket.join(roomId);
            console.log(`Room ${roomId} created by ${socket.id}`);
        }
    });

    socket.on('joinRoom', (roomId) => {
        if (rooms[roomId] && rooms[roomId].players.length === 1) {
            rooms[roomId].players.push(socket.id);
            socket.join(roomId);
            io.to(roomId).emit('startGame');
            console.log(`Player ${socket.id} joined room ${roomId}`);
        } else if (rooms[roomId] && rooms[roomId].players.length >= 2) {
            socket.emit('joinError', 'Room is already full');
        } else {
            socket.emit('joinError', 'Room does not exist');
        }
    });

    socket.on('makeMove', (data) => {
        const { roomId, board, isXNext, status } = data;
        io.to(roomId).emit('moveMade', { board, isXNext, status });
    });

    socket.on('leaveRoom', (roomId) => {
        if (rooms[roomId]) {
            const room = rooms[roomId];
            const index = room.players.indexOf(socket.id);
            if (index !== -1) {
                room.players.splice(index, 1); 
                if (room.players.length === 0) {
                    delete rooms[roomId]; 
                } else {
                    const opponent = room.players[0];
                    io.to(opponent).emit('opponentLeftRoom');
                    socket.leave(roomId);
                    console.log(`Player ${socket.id} left room ${roomId}`);
                }
            }
        }
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);

        for (const roomId in rooms) {
            if (rooms[roomId].players.includes(socket.id)) {
                const room = rooms[roomId];
                const index = room.players.indexOf(socket.id);
                if (index !== -1) {
                    room.players.splice(index, 1);
                    if (room.players.length === 0) {
                        delete rooms[roomId];
                    } else {
                        const opponent = room.players[0];
                        io.to(opponent).emit('opponentDisconnected');
                        console.log(`Player ${socket.id} left room ${roomId}`);
                    }
                }
                break;
            }
        }
    });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Socket.IO server listening on port ${PORT}`);
});
