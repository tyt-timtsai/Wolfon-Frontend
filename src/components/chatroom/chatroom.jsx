import React, { useEffect, useState, useRef } from 'react';
import './chatroom.css';
import {
  Button, TextField, List, ListItem, ListItemAvatar, Avatar, ListItemText,
} from '@mui/material';
import axios from 'axios';
import constants from '../../global/constants';

function Chatroom({ socket, room }) {
  const [userData, setUserData] = useState();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const messagesList = useRef();

  const editorMessage = (e) => {
    setMessage(e.target.value);
  };

  const snedMessage = (e) => {
    e.preventDefault();
    if (message) {
      socket.emit('chat message', { id: socket.id, name: userData.name, msg: message });
      setMessage('');
    }
  };

  useEffect(() => {
    axios.get(constants.PROFILE_API, {
      headers: {
        authorization: window.localStorage.getItem('JWT'),
      },
    })
      .then((res) => {
        setUserData(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

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
      <List id="messages-list" ref={messagesList}>
        {messages.map((data) => (
          <ListItem key={Math.random()} alignItems="flex-start" value={data.msg}>
            <ListItemAvatar>
              <Avatar alt="avatar" />
            </ListItemAvatar>
            <ListItemText
              primary={data.name}
              secondary={data.msg}
              sx={{ display: 'inline', color: '#fff' }}
              component="span"
              variant="body2"
              color="#fff"
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
