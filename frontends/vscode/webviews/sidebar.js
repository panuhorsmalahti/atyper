console.log("sidebar.js loaded");

const addMessage = (message) => {
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message');
    messageElement.textContent = message;

    document.getElementById('chat-messages').appendChild(messageElement);
};

document.getElementById('chat-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const input = document.getElementById('chat-input');
    const message = input.value.trim();

    addMessage("you: " + message);

    if (message) {
        console.log('Message sent:', message);
        input.value = '';

        tsvscode.postMessage({ type: "sendChatMessage", value: message });
    }
});

// Listen for messages from the extension
window.addEventListener("message", (event) => {
    const message = event.data;

    if (message.type === "chatMessageResponse") {
        addMessage("atyper: " + message.value);
    }
});
