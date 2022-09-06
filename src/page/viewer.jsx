import React, { useState, useRef } from 'react';
import Header from '../components/header/header';
// import Footer from '../components/footer/footer';
import Editor from '../components/editor/editor';
import Video from '../components/video/video';
import Chatroom from '../components/chatroom/chatroom';
import './viewer.css';

function LiveViewer({ socket }) {
  const room = 'room1';
  const editor = useRef();
  const [mode, setMode] = useState('javascript');
  const [version, setVersion] = useState([]);
  const [code, setCode] = useState("//Javascript\nconsole.log('Hello Javascript!');");
  return (
    <div>
      <Header />
      <div id="viewer-container">
        <Video
          socket={socket}
          room={room}
        />
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
      <div id="viewer-chatroom">
        <Chatroom
          socket={socket}
          room={room}
        />
      </div>
      {/* <Footer /> */}
    </div>
  );
}

export default LiveViewer;
