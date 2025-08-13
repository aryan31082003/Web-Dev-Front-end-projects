
const socket = io();
let username = '';
let typingTimeout;
let myBlockedUsers = new Set();

const loginScreen = document.getElementById('loginScreen');
const usernameError = document.getElementById('usernameError');
const chatContainer = document.getElementById('chatContainer');
const usernameInput = document.getElementById('usernameInput');
const enterChat = document.getElementById('enterChat');
const usersList = document.getElementById('users');
const blockedUsersList = document.getElementById('blockedUsersList');
const messagesDiv = document.getElementById('messages');
const typingIndicator = document.getElementById('typingIndicator');
const messageForm = document.getElementById('messageForm');
const messageInput = document.getElementById('messageInput');
const fileInput = document.getElementById('fileInput');
const attachFileButton = document.getElementById('attachFileButton');

enterChat.onclick = () => {
    username = usernameInput.value.trim();
    if (username) {
        socket.emit('setUsername', username);
    } else {
        usernameError.textContent = 'Please enter a username.';
    }
};

socket.on('usernameTaken', (message) => {
    usernameError.textContent = message;
    usernameInput.value = '';
});

socket.on('userList', (users) => {
    usersList.innerHTML = '';
    users.forEach(user => {
        if (user === username) {
            usersList.innerHTML += `<li><span class="username-list-item">You (${user})</span></li>`;
        } else {
            const li = document.createElement('li');
            const usernameSpan = document.createElement('span');
            usernameSpan.classList.add('username-list-item');
            usernameSpan.textContent = user;
            li.appendChild(usernameSpan);

            const actionButton = document.createElement('button');
            if (myBlockedUsers.has(user)) {
                actionButton.textContent = 'Unblock';
                actionButton.classList.add('unblock-button');
                actionButton.onclick = () => socket.emit('unblockUser', user);
            } else {
                actionButton.textContent = 'Block';
                actionButton.classList.add('block-button');
                actionButton.onclick = () => socket.emit('blockUser', user);
            }
            li.appendChild(actionButton);
            usersList.appendChild(li);
        }
    });
});

socket.on('myBlockedUsers', (blockedUsersArray) => {
    myBlockedUsers = new Set(blockedUsersArray);
    updateBlockedUsersListUI();
});

function updateBlockedUsersListUI() {
    blockedUsersList.innerHTML = '';
    if (myBlockedUsers.size === 0) {
        blockedUsersList.innerHTML = '<li>No users blocked.</li>';
        return;
    }
    myBlockedUsers.forEach(blockedUser => {
        const li = document.createElement('li');
        const usernameSpan = document.createElement('span');
        usernameSpan.classList.add('username-list-item');
        usernameSpan.textContent = blockedUser;
        li.appendChild(usernameSpan);

        const unblockButton = document.createElement('button');
        unblockButton.textContent = 'Unblock';
        unblockButton.classList.add('unblock-button');
        unblockButton.onclick = () => socket.emit('unblockUser', blockedUser);
        li.appendChild(unblockButton);
        blockedUsersList.appendChild(li);
    });
}

socket.on('clearChat', () => {
    messagesDiv.innerHTML = '';
});

socket.on('blockStatusUpdated', ({ blockedUsername, status }) => {
    console.log(`${blockedUsername} ${status}.`);
    if (status === 'blocked') {
        myBlockedUsers.add(blockedUsername);
    } else {
        myBlockedUsers.delete(blockedUsername);
    }
    updateBlockedUsersListUI();
    // Re-request user list and history to update button states
    socket.emit('setUsername', username);
});


socket.on('chatHistory', (history) => {
    messagesDiv.innerHTML = '';
    history.forEach(addMessage);
    if (loginScreen.style.display !== 'none') {
        loginScreen.style.display = 'none';
        chatContainer.style.display = 'flex';
    }
});


socket.on('newMessage', (msg) => {
    addMessage(msg);
});

attachFileButton.onclick = () => {
    fileInput.click();
};

fileInput.onchange = () => {
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const fileData = e.target.result;
            const fileName = file.name;
            const fileType = file.type;

            socket.emit('fileMessage', { fileName, fileType, fileData });
            fileInput.value = '';
            socket.emit('typing', false);
        };
        reader.readAsArrayBuffer(file);
    }
};

messageForm.onsubmit = (e) => {
    e.preventDefault();
    const text = messageInput.value.trim();
    if (text) {
        socket.emit('chatMessage', text);
        messageInput.value = '';
        socket.emit('typing', false);
    }
};

messageInput.oninput = () => {
    socket.emit('typing', true);
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => socket.emit('typing', false), 1000);
};

socket.on('typing', ({ user, isTyping }) => {
    if (user !== username) {
        if (isTyping) {
            typingIndicator.textContent = `${user} is typing...`;
        } else {
            typingIndicator.textContent = '';
        }
    } else {
        typingIndicator.textContent = '';
    }
});

function addMessage({ user, text, time, file }) {
    const div = document.createElement('div');
    div.classList.add('message');

    if (user === username) {
        div.classList.add('mine');
    } else {
        div.classList.add('other');
    }

    const messageContent = document.createElement('div');
    messageContent.innerHTML = `<span class="username">${user}</span><span class="time">[${time}]</span>: `;

    if (file) {
        const fileDiv = document.createElement('div');
        fileDiv.classList.add('file-attachment');

        if (file.fileType.startsWith('image/')) {
            const img = document.createElement('img');
            img.src = file.url;
            img.alt = file.fileName;
            img.classList.add('image-attachment');
            fileDiv.appendChild(img);
        } else {
            const fileIcon = document.createElement('span');
            fileIcon.classList.add('file-icon');
            fileIcon.innerHTML = '&#x1F4C4;';

            const fileLink = document.createElement('a');
            fileLink.href = file.url;
            fileLink.target = '_blank';
            fileLink.textContent = file.fileName;

            fileDiv.appendChild(fileIcon);
            fileDiv.appendChild(fileLink);
        }
        messageContent.appendChild(fileDiv);
    } else if (text) {
        const textNode = document.createTextNode(text);
        messageContent.appendChild(textNode);
    }

    div.appendChild(messageContent);
    messagesDiv.appendChild(div);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}