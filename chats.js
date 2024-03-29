const sessions = require('./sessions');

let users = { 
  "Amit": "Amit", 
  "Bao": "Bao",  
};

let messages = [ 
  {
    sender: "Amit",
    text: "You up?",
  },
  {
    sender: "Bao",
    text: "Yeah, still working on this INFO6250 work, but I keep getting distracted by cat videos",
  }
];

function isValidUsername(username) {
  let isValid = true;
  isValid = isValid && username.trim();
  isValid = isValid && username.match(/^[A-Za-z0-9_]+$/);
  return isValid;
}


function loginUser(username) {
  users[username] = username;
}

function logoutUser(username) {
  delete users[username];
}

function getLoggedInUsers() {
  return Object.keys(users);
}

function addMessage(sender, text) {
  const message = { sender, text };
  messages.push(message);
}

function getAllMessages() {
  return messages;
}


module.exports = {
  isValidUsername,
  loginUser,
  logoutUser,
  getLoggedInUsers,
  addMessage,
  getAllMessages,
};