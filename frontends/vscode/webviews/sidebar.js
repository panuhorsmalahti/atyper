console.log("sidebar.js loaded");

const addMessage = (message) => {
    const messageElement = document.createElement('div');

    messageElement.classList.add('chat-message');
    messageElement.textContent = message;

    document.getElementById('chat-messages').appendChild(messageElement);
};

const addQuestion = (question, fileContents) => {
    const questionElement = document.createElement('div');

    questionElement.classList.add('chat-question');
    questionElement.textContent = question;

    document.getElementById('chat-messages').appendChild(questionElement);
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
    } else if (message.type === "question") {
        addQuestion(message.question, message.fileContents);
    } else {
        console.warn("unknon message type " + message.type);
    }
});
