document.getElementById('send-button').addEventListener('click', sendMessage);
document.getElementById('user-input').addEventListener('keypress', function (e) {
    if (e.key == 'Enter') {
        sendMessage();
    }
});

async function fetchWikipediaData(query) {
    const response = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${query}&utf8=&format=json&origin=*`);
    const data = await response.json();
    if (data.query.search.length > 0) {
        const pageId = data.query.search[0].pageid;
        return fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&format=json&origin=*&pageids=${pageId}`)
            .then(response => response.json())
            .then(data => data.query.pages[pageId].extract);
    } else {
        return "Sorry, I couldn't find any relevant information.";
    }
}

async function sendMessage() {
    const userInput = document.getElementById('user-input');
    const message = userInput.value.trim();
    if (message) {
        displayMessage(message, 'user');
        userInput.value = '';

        // Fetch data from Wikipedia
        const wikiData = await fetchWikipediaData(message);
        displayMessage(wikiData, 'bot');
    }
}

function displayMessage(message, sender) {
    const chatWindow = document.getElementById('chat-window');
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message', sender);
    messageElement.textContent = message;
    chatWindow.appendChild(messageElement);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}
