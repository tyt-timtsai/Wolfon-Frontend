import React, { useEffect, useState, useRef } from 'react';
import './chatroom.css';
import {
  Button, TextField, List, ListItem, ListItemAvatar, Avatar, ListItemText,
} from '@mui/material';
import { BiImageAdd } from 'react-icons/bi';
import { GiCancel } from 'react-icons/gi';
// import axios from 'axios';
import constants from '../../global/constants';

function Chatroom({ socket, room, userData }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const messagesList = useRef();

  const editorMessage = (e) => {
    setMessage(e.target.value);
  };

  const snedMessage = (e) => {
    e.preventDefault();
    // if(file){
    //   axios.post()
    // }
    if (message) {
      socket.emit('chat message', {
        room,
        id: socket.id,
        name: userData.name,
        photo: userData.photo || null,
        msg: message,
        file,
      });
      setMessage('');
      setFile(null);
    }
  };

  const handleUpload = (e) => setFile(e.target.files[0]);
  const deleteFile = () => setFile(null);

  useEffect(() => {
    if (messagesList.current) {
      messagesList.current.scrollTop = messagesList.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    socket.on('chat message', (data) => {
      setMessages((prev) => [...prev, data]);
    });
    return (() => socket.close());
  }, [socket]);

  useEffect(() => {
    console.log(file);
  }, [file]);

  return (
    <div id="chatroom-container">
      <List id="messages-list" ref={messagesList}>
        {messages.map((data) => (
          <ListItem key={Math.random()} alignItems="flex-start" value={data.msg}>
            <ListItemAvatar>
              <Avatar
                alt="avatar"
                src={data.photo ? `${constants.IMAGE_URL}/${data.photo}` : '#'}
              />
            </ListItemAvatar>
            <ListItemText
              primary={data.name}
              secondary={data.msg}
              sx={{ display: 'inline', color: '#fff' }}
              component="span"
              variant="body2"
              color="#fff"
            />
            {data.file ? (
              <button type="button">
                <img src={data.file} alt="upload_image" />
              </button>
            ) : null}
          </ListItem>
        ))}

      </List>
      <form id="message-form" onSubmit={snedMessage}>
        <label htmlFor="screenshot-upload-input" id="screenshot-upload-label">
          <BiImageAdd id="screenshot-upload-icon" />
          <input hidden accept="image/*" type="file" id="screenshot-upload-input" onChange={handleUpload} />
        </label>

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
      {file ? (
        <div id="stream-upload-preview">
          <button type="button" onClick={deleteFile} id="stream-upload-cancel-btn">
            <GiCancel id="stream-upload-cancel-icon" />
          </button>
          <img src={URL.createObjectURL(file)} alt="upload_image" id="stream-upload-preview-img" />
        </div>
      ) : null}
    </div>
  );
}

export default Chatroom;
