const socket = new WebSocket('ws://localhost:3000');
const chatArea = document.getElementById('chat-area');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');

socket.addEventListener('message', (event) => {
    addMessageToChatArea(event.data);
});

messageForm.addEventListener('submit', (event) => {
    event.preventDefault();

    event.preventDefault();

    if (messageInput.value) {
        socket.send(messageInput.value);
        addMessageToChatArea(messageInput.value, 'self'); // Add the sent message to the chat area
        messageInput.value = '';
    }
});

// Function to append messages to the chat area
function addMessageToChatArea(message, sender = 'other') {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add(sender);
    messageDiv.textContent = message;
    chatArea.appendChild(messageDiv);
    chatArea.scrollTop = chatArea.scrollHeight; // Scroll to the bottom
}
