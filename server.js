const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 3000;

const sessions = require('./sessions');
const chats = require('./chats');

app.use(cookieParser());
app.use(express.static('./public'));
app.use(express.json());

app.get('/api/v1/session', (req, res) => {
    const sid = req.cookies.sid;
    const username = sid ? sessions.getSessionUser(sid) : '';
    const loggedInUsers = sessions.getLoggedInUsers();
    if(!sid || !username) {
      res.status(401).json({ error: 'auth-missing' });
      return;
    }
    res.json({ username, loggedInUsers });
});

app.post('/api/v1/session', (req, res) => {
    const { username } = req.body;
  
    if(!chats.isValidUsername(username)) {
      res.status(400).json({ error: 'required-username' });
      return;
    }
  
    if(username === 'dog') {
      res.status(403).json({ error: 'auth-insufficient' });
      return;
    }
  
    try {
      const sid = sessions.addSession(username);
      res.cookie('sid', sid, { httpOnly: true });
      res.json({ username });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'internal-error' });
    }
});

app.get('/api/v1/chat', (req, res) => {
    const sid = req.cookies.sid;
    const username = sid ? sessions.getSessionUser(sid) : '';
  
    if(!sid || !username) {
      res.status(401).json({ error: 'auth-missing' });
      return;
    }

    try {
      const messages = chats.getAllMessages();

      const users = sessions.getLoggedInUsers();
    
      res.json({ username, users, messages });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'internal-error' });
    }
});

app.put('/api/v1/message', (req, res) => {
    const sid = req.cookies.sid;
    const username = sid ? sessions.getSessionUser(sid) : '';
    if(!sid || !username) {
      res.status(401).json({ error: 'auth-missing' });
      return;
    }
  
    const { message } = req.body;
  
    if(!message.trim()) {
      res.status(400).json({ error: 'required-word' });
      return;
    }
  
    chats.addMessage(username, message);

    const messages = chats.getAllMessages();
  
    res.json({ username, messages });
});

app.delete('/api/v1/session', (req, res) => {
    const sid = req.cookies.sid;
    const username = sid ? sessions.getSessionUser(sid) : '';

    if(sid) {
      res.clearCookie('sid');
    }

    if(username) {
      sessions.deleteSession(sid);
    }

    res.json({ wasLoggedIn: !!username });
});

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));