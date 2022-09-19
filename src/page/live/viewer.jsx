import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';
import Editor from '../../components/editor/editor';
import Video from '../../components/video/video';
import Chatroom from '../../components/chatroom/chatroom';
import './viewer.css';

function LiveViewer({ socket, room, setRoom }) {
  const editor = useRef();
  const params = useParams();
  const [mode, setMode] = useState('javascript');
  const [version, setVersion] = useState([]);
  const [code, setCode] = useState("//Javascript\nconsole.log('Hello Javascript!');");
  const [isComplier, setIsComplier] = useState(true);
  const [isConnect, setIsConnect] = useState(false);

  const handleChange = () => {
    setIsComplier(!isComplier);
  };

  useEffect(() => {
    console.log(params.id);
    setRoom(params.id);
  }, []);

  return (
    <>
      <Header />

      <div id="viewer-container">
        <div
          id="viewer-video-container"
          style={isConnect ? {
            backgroundColor: '#000',
          } : {
            background: 'linear-gradient(0deg, rgba(0,0,0,1) 0%, rgb(60, 60, 60) 100%)',
          }}
        >
          <Video
            socket={socket}
            room={room}
            isConnect={isConnect}
            setIsConnect={setIsConnect}
          />
        </div>
        <div id="veiwer-side-container">
          <div id="viewer-btns-container">
            <button
              type="button"
              className="viewer-btns"
              onClick={handleChange}
              style={isComplier ? {
                color: 'var(--main-bg-color)',
                backgroundColor: 'var(--main-color)',
                borderRadius: '10px',
              } : {
                color: 'var(--secondary-color)',
              }}
            >
              Complier
            </button>
            <button
              type="button"
              className="viewer-btns"
              onClick={handleChange}
              style={!isComplier ? {
                color: 'var(--main-bg-color)',
                backgroundColor: 'var(--main-color)',
                borderRadius: '10px',
              } : {
                color: 'var(--secondary-color)',
              }}
            >
              Chatroom
            </button>
          </div>
          <div id="viewer-editor-container" style={isComplier ? { display: 'flex' } : { display: 'none' }}>
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
          <div id="viewer-chatroom" style={isComplier ? { display: 'none' } : { display: 'flex' }}>
            <Chatroom
              socket={socket}
              room={room}
            />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default LiveViewer;
