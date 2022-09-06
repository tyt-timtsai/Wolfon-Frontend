import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Button, TextField, ImageList, ImageListItem,
} from '@mui/material';
import Header from '../components/header/header';
import Footer from '../components/footer/footer';
import Editor from '../components/editor/editor';
import Streamer from '../components/video/streamer';
import Chatroom from '../components/chatroom/chatroom';
import constants from '../global/constants';
import './streamer.css';

function LiveStreamer({ socket }) {
  const room = 'room1';
  const [isStreaming, setIsStreaming] = useState(false);
  const [mode, setMode] = useState('javascript');
  const [version, setVersion] = useState([]);
  const [code, setCode] = useState("//Javascript\nconsole.log('Hello Javascript!');");
  const [tag, setTag] = useState('');
  const [viewers, setViewers] = useState([]);
  const [screenshots, setScreenshots] = useState([]);
  const editor = useRef();
  const canvasRef = useRef();
  const localVideo = useRef();

  const editTag = (e) => {
    setTag(e.target.value);
  };

  const addTag = () => {
    const content = editor.current.editor.getValue();
    if (tag && content) {
      axios.post(`${constants.SERVER_URL}/api/v1/code/${room}`, {
        language: mode,
        tag,
        code: content,
      })
        .then((res) => {
          socket.emit('addTag', tag);
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  // Get viewer's code
  const getViewerCode = (e) => {
    console.log(e.target.value);
    socket.emit('getCode', e.target.value, socket.id);
  };

  // Create Screenshot on stream
  const screenShot = () => {
    if (isStreaming) {
      const scale = 0.2;
      const video = localVideo.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth * scale;
      canvas.height = video.videoHeight * scale;
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
      setScreenshots((prev) => [...prev, { src: canvas.toDataURL('image/png') }]);
    }
  };

  useEffect(() => {
    socket.on('viewer', (id) => {
      console.log(id);
      setViewers((prev) => [...prev, id]);
    });

    socket.on('passCode', (viewerCode) => {
      console.log(viewerCode);
      setCode(viewerCode);
    });
  }, [socket]);

  useEffect(() => {
    console.log('start');
  }, []);
  return (
    <div>
      <Header />
      <section id="streamer-container">
        <div id="streamer-video-container">
          <Streamer
            socket={socket}
            room={room}
            localVideo={localVideo}
            setIsStreaming={setIsStreaming}
            screenShot={screenShot}
          />
          <div id="viewers-list">
            {viewers.map((viewer) => (
              <Button variant="contained" type="button" value={viewer} key={viewers.indexOf(viewer)} onClick={getViewerCode}>{viewers.indexOf(viewer)}</Button>
            ))}
          </div>
        </div>

        <div id="streamer-editor">
          <TextField label="Tag" size="small" variant="outlined" type="text" name="tag" id="tag" value={tag} onChange={editTag} />
          <Button variant="contained" type="button" className="editor-btn" id="tag-btn" onClick={addTag}>Add tag</Button>
          <Editor
            socket={socket}
            room={room}
            mode={mode}
            setMode={setMode}
            version={version}
            setVersion={setVersion}
            code={code}
            setCode={setCode}
            editor={editor}
          />
        </div>

        <div id="editor-chatroom">
          <Chatroom
            socket={socket}
            room={room}
          />
        </div>
      </section>
      <canvas ref={canvasRef} />
      <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164} id="screenShot-container">
        {screenshots.map((screenshot) => (
          screenshot.src
            ? (
              <ImageListItem key={screenshots.indexOf(screenshot)}>
                <img src={screenshot.src} className="screenshots-img" alt="screenshot" loading="lazy" />
              </ImageListItem>
            )
            : null
        ))}
      </ImageList>
      <Footer />
    </div>
  );
}

export default LiveStreamer;
