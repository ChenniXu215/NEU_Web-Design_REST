const uuid = require('uuid').v4;

const sessions = {};

const userSessionCounts = {};

function addSession(username) {
    const sid = uuid();
    sessions[sid] = {
      username,
    };

    if (!userSessionCounts[username]) {
        userSessionCounts[username] = 0;
    }
    userSessionCounts[username] += 1;
    return sid;
}

function getSessionUser(sid) {
    return sessions[sid]?.username;
}
  
function deleteSession(sid) {
    const username = sessions[sid]?.username;
    if (username) {
        userSessionCounts[username] = (userSessionCounts[username] || 1) - 1;
        
        if (userSessionCounts[username] <= 0) {
            delete userSessionCounts[username];
        }
    }
    delete sessions[sid];
}

function getLoggedInUsers() {
    return Object.keys(userSessionCounts);
}
  
module.exports = {
    addSession,
    deleteSession,
    getSessionUser, 
    getLoggedInUsers, 
    userSessionCounts, 
};