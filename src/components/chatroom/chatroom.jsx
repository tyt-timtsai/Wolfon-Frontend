import React, { useEffect, useState, useRef } from 'react';
import './chatroom.css';
import {
  Box, Button, TextField, List, ListItem, ListItemAvatar, Avatar, ListItemText,
} from '@mui/material';
import { BiImageAdd } from 'react-icons/bi';
import { GiCancel } from 'react-icons/gi';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import ImageModal from './imageModal';
import constants from '../../global/constants';

function Chatroom({ socket, room, userData }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [open, setOpen] = useState(false);
  const messagesList = useRef();

  // const handleOpen = () => setOpen(true);
  const handleOpen = (e) => {
    setOpen(e.target.alt);
  };
  const handleClose = () => setOpen(false);

  const editorMessage = (e) => {
    setMessage(e.target.value);
  };

  const snedMessage = async (e) => {
    e.preventDefault();
    setIsSending(true);
    let imageUrl = null;
    if (file) {
      const formData = new FormData();
      formData.append('roomId', room);
      formData.append('image', file);
      const result = await axios.post(constants.UPLOAD_SCEEENSHOT_API, formData, {
        headers: {
          authorization: window.localStorage.getItem('JWT'),
        },
      });
      console.log(result);
      imageUrl = result.data.data.url;
    }

    if (message || imageUrl) {
      socket.emit('chat message', {
        room,
        id: socket.id,
        name: userData.name,
        photo: userData.photo || null,
        msg: message,
        image: imageUrl,
      });
      setMessage('');
      setFile(null);
      setIsSending(false);
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

  return (
    <div id="chatroom-container">
      <List id="messages-list" ref={messagesList}>
        {messages.map((data, index) => (
          <div className="message-list-item" key={Math.random()}>
            <ListItem alignItems="flex-start" value={data.msg}>
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
            </ListItem>
            {data.image ? (
              <>
                <button type="button" className="chatroom-img-btn" onClick={handleOpen}>
                  <img src={`${constants.IMAGE_URL}/${data.image}`} alt={index} className="chatroom-img" />
                </button>
                <ImageModal
                  open={open}
                  index={index}
                  imageUrl={data.image}
                  handleClose={handleClose}
                />
              </>
            ) : null}
          </div>
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
        <Button
          variant="contained"
          type="message-btn"
          id="chatroom-message-btn"
          onClick={snedMessage}
          disabled={isSending}
        >
          {isSending ? (
            <Box sx={{ display: 'flex' }}>
              <CircularProgress size={30} />
            </Box>
          ) : 'Send'}
        </Button>
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
