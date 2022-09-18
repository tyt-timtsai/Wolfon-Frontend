import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Button, ImageList, ImageListItem,
} from '@mui/material';
import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';
import Editor from '../../components/editor/editor';
import Streamer from '../../components/video/streamer';
import Chatroom from '../../components/chatroom/chatroom';
import constants from '../../global/constants';
import './streamer.css';

function LiveStreamer({ socket, room, setRoom }) {
  // const room = 'room1';
  const [isStreaming, setIsStreaming] = useState(false);
  const [mode, setMode] = useState('javascript');
  const [version, setVersion] = useState([]);
  const [code, setCode] = useState("//Javascript\nconsole.log('Hello Javascript!');");
  const [tag, setTag] = useState('');
  const [from, setFrom] = useState('');
  const [isFrom, setIsFrom] = useState(false);
  const [viewers, setViewers] = useState([]);
  const [screenshots, setScreenshots] = useState([]);
  const [isShow, setIsShow] = useState(true);
  const editor = useRef();
  const canvasRef = useRef();
  const localVideo = useRef();
  const isStreamer = true;

  const addTag = () => {
    const content = editor.current.editor.getValue();
    const newTag = {
      language: mode,
      tag,
      code: content,
    };
    if (isFrom) {
      newTag.from = from || null;
    }
    if (tag && content) {
      axios.post(`${constants.SERVER_URL}/api/v1/code/${room}`, newTag)
        .then((res) => {
          socket.emit('addTag', newTag);
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

  async function signRoom() {
    const data = 'Hello';
    const result = await axios.post(`${constants.SERVER_URL}/api/v1/live`, data, {
      headers: {
        authorization: `Bearer ${window.localStorage.getItem('JWT')}`,
      },
    });
    const roomId = result.data.liveData.room_id;
    console.log(roomId);
    // setRoom(roomId);
    setRoom('room1');
  }

  const handleShow = () => {
    setIsShow(!isShow);
  };

  useEffect(() => {
    signRoom();
  }, []);

  useEffect(() => {
    console.log(room);
    socket.on('viewer', (id, name) => {
      console.log(id);
      console.log(name);
      setViewers((prev) => [...prev, { id, name }]);
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
    <>
      <Header />
      <section id="streamer-container">
        <button id="streamer-hide-btn" type="button" onClick={handleShow}>{isShow ? 'HIDE VIDEO & CHAT' : 'SHOW VIDEO & CHAT' }</button>
        <div id="streamer-header-container" style={isShow ? { display: 'flex' } : { display: 'none' }}>
          <div id="streamer-video-container">
            <Streamer
              socket={socket}
              room={room}
              localVideo={localVideo}
              setIsStreaming={setIsStreaming}
              screenShot={screenShot}
              tag={tag}
              setTag={setTag}
              addTag={addTag}
              isStreamer={isStreamer}
            />
            <div id="viewers-list">
              {viewers.map((viewer) => (
                <Button variant="contained" type="button" value={viewer.id} key={viewer.id} onClick={getViewerCode}>{viewer.name}</Button>
              ))}
            </div>
          </div>
          <div id="editor-chatroom">
            <Chatroom
              socket={socket}
              room={room}
            />
          </div>
        </div>

        <div id="streamer-editor">
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
            isStreamer={isStreamer}
            setTag={setTag}
            addTag={addTag}
            setFrom={setFrom}
            from={from}
            isFrom={isFrom}
            setIsFrom={setIsFrom}
            screenShot={screenShot}
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
    </>
  );
}

export default LiveStreamer;
