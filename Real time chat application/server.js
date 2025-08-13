const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    maxHttpBufferSize: 1e8 // 100 MB
});

app.use(express.static(path.join(__dirname, 'public')));

const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOPLOADS_DIR, { recursive: true });
}
app.use('/uploads', express.static(UPLOADS_DIR));

let users = {}; // socket.id -> username
let blockedUsers = new Map(); // blockerUsername -> Set<blockedUsername>
let messages = [];

function isBlocked(blockerUsername, blockedUsername) {
    return blockedUsers.has(blockerUsername) && blockedUsers.get(blockerUsername).has(blockedUsername);
}

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    let currentUsername = '';

    socket.on('setUsername', (username) => {
        if (Object.values(users).includes(username)) {
            socket.emit('usernameTaken', `Username '${username}' is already taken. Please choose another.`);
            return;
        }

        users[socket.id] = username;
        currentUsername = username;
        console.log(`User ${socket.id} set username to: ${username}`);

        const filteredHistory = messages.filter(msg => !isBlocked(currentUsername, msg.user));
        socket.emit('chatHistory', filteredHistory);

        sendUserListToAll();
    });

    socket.on('chatMessage', (msg) => {
        const user = users[socket.id] || 'Anonymous';
        const message = { user, text: msg, time: new Date().toLocaleTimeString() };
        messages.push(message);

        io.sockets.sockets.forEach(s => {
            const recipientUsername = users[s.id];
            if (recipientUsername && !isBlocked(recipientUsername, user)) {
                s.emit('newMessage', message);
            }
        });
    });

    socket.on('fileMessage', ({ fileName, fileType, fileData }) => {
        const user = users[socket.id] || 'Anonymous';
        const uniqueFileName = `${Date.now()}_${fileName}`;
        const filePath = path.join(UPLOADS_DIR, uniqueFileName);
        const fileUrl = `/uploads/${uniqueFileName}`;

        fs.writeFile(filePath, fileData, (err) => {
            if (err) {
                console.error('Error saving file:', err);
                socket.emit('errorMessage', 'Failed to upload file.');
                return;
            }
            console.log(`File saved: ${filePath}`);

            const message = {
                user,
                file: {
                    fileName,
                    fileType,
                    url: fileUrl
                },
                time: new Date().toLocaleTimeString()
            };
            messages.push(message);

            io.sockets.sockets.forEach(s => {
                const recipientUsername = users[s.id];
                if (recipientUsername && !isBlocked(recipientUsername, user)) {
                    s.emit('newMessage', message);
                }
            });
        });
    });

    socket.on('typing', (isTyping) => {
        const user = users[socket.id];

        io.sockets.sockets.forEach(s => {
            if (s.id !== socket.id) {
                const recipientUsername = users[s.id];
                if (recipientUsername && user && !isBlocked(recipientUsername, user)) {
                    s.emit('typing', { user, isTyping });
                }
            }
        });
    });

    socket.on('blockUser', (blockedUsername) => {
        if (!currentUsername) return;

        if (!blockedUsers.has(currentUsername)) {
            blockedUsers.set(currentUsername, new Set());
        }
        blockedUsers.get(currentUsername).add(blockedUsername);
        console.log(`${currentUsername} blocked ${blockedUsername}. Current blocks:`, blockedUsers.get(currentUsername));

        const filteredHistory = messages.filter(msg => !isBlocked(currentUsername, msg.user));
        socket.emit('clearChat');
        socket.emit('chatHistory', filteredHistory);
        sendUserListToAll();
        socket.emit('blockStatusUpdated', { blockedUsername, status: 'blocked' });
    });

    socket.on('unblockUser', (unblockedUsername) => {
        if (!currentUsername) return;

        if (blockedUsers.has(currentUsername)) {
            blockedUsers.get(currentUsername).delete(unblockedUsername);
            if (blockedUsers.get(currentUsername).size === 0) {
                blockedUsers.delete(currentUsername);
            }
        }
        console.log(`${currentUsername} unblocked ${unblockedUsername}. Current blocks:`, blockedUsers.get(currentUsername));

        const filteredHistory = messages.filter(msg => !isBlocked(currentUsername, msg.user));
        socket.emit('clearChat');
        socket.emit('chatHistory', filteredHistory);
        sendUserListToAll();
        socket.emit('blockStatusUpdated', { blockedUsername: unblockedUsername, status: 'unblocked' });

        const allOnlineUsernames = Object.values(users);
    const availableUsers = allOnlineUsernames.filter(user =>
        user !== currentUsername && !isBlocked(currentUsername, user)
    );
    const userListForRecipient = [currentUsername, ...availableUsers];
    socket.emit('userList', userListForRecipient);

    const currentBlockersBlockedUsers = Array.from(blockedUsers.get(currentUsername) || new Set());
    socket.emit('myBlockedUsers', currentBlockersBlockedUsers);
    });


    socket.on('disconnect', () => {
        if (currentUsername) {
            delete users[socket.id];
            blockedUsers.delete(currentUsername);

            console.log('User disconnected:', socket.id, `(${currentUsername})`);
            sendUserListToAll();
            io.sockets.sockets.forEach(s => {
                const recipientUsername = users[s.id];
                if (recipientUsername && !isBlocked(recipientUsername, currentUsername)) {
                    s.emit('typing', { user: currentUsername, isTyping: false });
                }
            });
        } else {
            console.log('Anonymous user disconnected:', socket.id);
        }
    });

    function sendUserListToAll() {
        io.sockets.sockets.forEach(s => {
            const recipientUsername = users[s.id];
            if (recipientUsername) {
                const allOnlineUsernames = Object.values(users);
                const availableUsers = allOnlineUsernames.filter(user =>
                    user !== recipientUsername && !isBlocked(recipientUsername, user)
                );

                const userListForRecipient = [recipientUsername, ...availableUsers];
                s.emit('userList', userListForRecipient);

                const currentBlockersBlockedUsers = Array.from(blockedUsers.get(recipientUsername) || new Set());
                s.emit('myBlockedUsers', currentBlockersBlockedUsers);
            }
        });
    }
});

server.listen(3000, () => console.log('Server running at http://localhost:3000'));