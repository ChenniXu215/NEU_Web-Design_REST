import {handleLogin, handleSendMessage, handleLogout} from "./listeners";

const appEl = document.getElementById('app');

export const messages = {
    'required-username': "Username should only contain letters and numbers.", 
    'auth-insufficient': "Please enter autentic username.", 
    'required-word': "Please input message to send.", 
    'auth-missing' : "Please login to send message.", 
    'internal-error': "An internal error occurred. Please try again later.",
    'network-error': "There was a problem reaching the server. Please try again.",
    default: "Unexpected error. Please try again"
}

export function showLoginPage() {
    appEl.innerHTML = `
        <div class="login">
            <h2 class="login-title">Login Page</h2>
            <form id="login-form">
                <div class="login-input">
                    <label for="username">Username:</label>
                    <input id="username" type="text" name="username"/>
                </div>
                <p class="error" id="login-error"></p>
                <button class="login-btn"  type="submit">Login</button>
            </form>    
        </div>
    `;
    document.getElementById('login-form').addEventListener('submit', handleLogin);
}

export function showDataPage(username, users, messages) {
    appEl.innerHTML = `
        <div class="word-container">
            <h2  class="welcome-title" id="welcome-title">Hello! ${username}</h2>
            <div class="chat-group">
                <div class="chat-members">
                    <h3 class="group-title">Group Members</h3>
                    <div class="user-list" id="user-list">
                        ${getUserList(users)}
                    </div> 
                </div>
            </div>
            <div class="chat-app">
                <div class="show-message" id="show-message">
                    ${getMessageList(messages)}
                </div>
            </div>
            <div class="outgoing">
                <form id="outgoing-form">
                    <input type="hidden" name="username" value=${username}>
                    <input type="text" name="text" id="text" class="text-input" placeholder="Enter message to send">
                <button type="submit" class="send-btn">Send</button>
            </form>
            <p class="error" id="message-error"></p>
            </div>
            <div class="logout">
                <button class="logout-btn" id="logout">Logout</button>
            </div>
        </div>
    `;
    document.getElementById('outgoing-form').addEventListener('submit', handleSendMessage);
    document.getElementById('logout').addEventListener('click', handleLogout);    
}


export function getUserList(users) {
    return `<ul class="users">` +
        Object.values(users).map( user => `
        <li>
            <div class="user">
                <span class="username">${user}</span>
            </div>
        </li>
    `).join('') +
    `</ul>`;
}

export function getMessageList(messages) {
    return `<ol class="messages">` +
      `<ul class="sender-messages">${messages.map(m => `<ul class="senders"><li class="sender-name">${m.sender}:</li> <li class="sender-text">${m.text}</li></ul>`).join('')}
      </ul>` + 
      `</ol>`;
}