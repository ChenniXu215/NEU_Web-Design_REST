import { fetchLogin, fetchSessionStatus, fetchChat, fetchSendMessage, fetchLogout} from "./services";
import {messages, showDataPage, showLoginPage, getUserList, getMessageList} from "./render";

let isLoggedIn = false;
let pollingInterval;

export function render() {
    handlePageLoad();
}

export function handlePageLoad() {
    showLoadingIndicator(true);

    fetchSessionStatus()
      .then(sessionInfo => {
        if (sessionInfo.username) {
          fetchChat().then(wordInfo => {
            showLoadingIndicator(false);
            showDataPage(sessionInfo.username,  sessionInfo.loggedInUsers, wordInfo.messages);
            startPolling();
          }).catch(err => {
            showLoginPage();
            stopPolling();
          });
        } else {
            showLoadingIndicator(false);
            showLoginPage();
            stopPolling();
        }
      })
      .catch(error => {
        showLoadingIndicator(false);
        showLoginPage();
        stopPolling();
      });
}


export function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const loginErrorEl = document.getElementById('login-error');

    showLoadingIndicator(true);

    fetchLogin(username)
    .then(data => {
        showLoadingIndicator(false);
        isLoggedIn = true;
        
        render();
    })
    .catch(error => {
        showLoadingIndicator(false);
        isLoggedIn = false;
        const m = messages[error.error] || messages.default;
        loginErrorEl.textContent = m;
        stopPolling();
    });
}

export function handleSendMessage(event) {
    event.preventDefault();
    const messageInput = document.getElementById('text').value;
    const messageErrorEl = document.getElementById('message-error');

    showLoadingIndicator(true);
    
    fetchSendMessage(messageInput)
      .then(response => {
        showLoadingIndicator(false);

        const showMessageDiv = document.querySelector('.show-message');
        showMessageDiv.innerHTML = getMessageList(response.messages);

        document.getElementById('text').value = '';

        messageErrorEl.textContent = '';
        render();
      })
      .catch(error => {
        showLoadingIndicator(false); 
        const errorMessage = messages[error.error] || messages.default;
        messageErrorEl.textContent = errorMessage;
        stopPolling();
        render();
      });
}

export function handleLogout(event) {
    event.preventDefault();
    fetchLogout().then(() => {
      isLoggedIn = false;
      stopPolling();
      render();
    })
    .catch((error) => {
    });
}

export function startPolling() {
    stopPolling();

    pollingInterval = setInterval(() => {
        fetchChat()
            .then(data => {
                const userListNode = document.getElementById('user-list');
                const messageListNode = document.getElementById('show-message');
                
                if (userListNode && messageListNode) {
                    userListNode.innerHTML = getUserList(data.users);
                    messageListNode.innerHTML = getMessageList(data.messages);
                }
            })
            .catch(error => console.error('Polling failed:', error));
    }, 5000);
}

export function stopPolling() {
    if (pollingInterval) {
        clearInterval(pollingInterval);
    }
}

export function showLoadingIndicator(show) {
    const loadingIndicator = document.getElementById('loading-indicator');
    if (show) {
        loadingIndicator.classList.remove('loading-hidden');
        loadingIndicator.classList.add('loading-visible');
    } else {
        loadingIndicator.classList.add('loading-hidden');
        loadingIndicator.classList.remove('loading-visible');
    }
}