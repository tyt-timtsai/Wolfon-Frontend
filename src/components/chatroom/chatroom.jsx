import React, { useEffect, useState, useRef } from 'react';
import './chatroom.css';
import {
  Button, TextField, List, ListItem, ListItemAvatar, Avatar, ListItemText,
} from '@mui/material';

function Chatroom({ socket, room }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const messagesList = useRef();

  const editorMessage = (e) => {
    setMessage(e.target.value);
  };

  const snedMessage = (e) => {
    e.preventDefault();
    socket.emit('chat message', { id: socket.id, msg: message });
    setMessage('');
  };

  useEffect(() => {
    if (messagesList.current) {
      messagesList.current.scrollTop = messagesList.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    socket.on('chat message', (data) => {
      console.log(data.msg);
      console.log(room);
      setMessages((prev) => [...prev, data]);
    });
    return (() => socket.close());
  }, [socket]);

  return (
    <div id="chatroom-container">
      <h1> Chatroom </h1>
      <List id="messages-list" ref={messagesList}>
        {messages.map((data) => (
          <ListItem key={Math.random()} alignItems="flex-start" value={data.msg}>
            <ListItemAvatar>
              <Avatar alt="avatar" />
            </ListItemAvatar>
            <ListItemText
              primary={`User Name : ${data.id}`}
              secondary={data.msg}
              sx={{ display: 'inline' }}
              component="span"
              variant="body2"
              color="text.primary"
            />
          </ListItem>
        ))}
      </List>
      <form id="message-form" onSubmit={snedMessage}>
        <TextField
          id="message-input"
          size="small"
          fullWidth
          label="Send message"
          value={message}
          onChange={editorMessage}
        />
        <Button variant="contained" type="message-btn" onClick={snedMessage}>Send</Button>
      </form>
    </div>
  );
}

export default Chatroom;
