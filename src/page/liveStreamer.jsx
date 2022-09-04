import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Header from '../components/header/header';
import Footer from '../components/footer/footer';
import Editor from '../components/editor/editor';
import Streamer from '../components/stream_video/streamer';
import constants from '../global/constants';

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
      {/* <header className="App-header">
        Live Streaming
      </header> */}
      <main>
        <Streamer
          socket={socket}
          room={room}
          localVideo={localVideo}
          setIsStreaming={setIsStreaming}
        />
        <button type="button" id="screenshot-button" onClick={screenShot}> 直播畫面截圖 </button>
        <div id="viewers">
          {viewers.map((viewer) => (<button type="button" value={viewer} onClick={getViewerCode}>{viewers.indexOf(viewer)}</button>))}
        </div>
        <label htmlFor="tag" aria-controls="tag">
          Tag :
          <input type="text" name="tag" id="tag" value={tag} onChange={editTag} />
        </label>
        <button type="button" className="editor-btn" id="tagBtn" onClick={addTag}>Add tag</button>
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
      </main>
      <canvas ref={canvasRef} />
      <div id="screenShot-container">
        {screenshots.map((screenshot) => (
          screenshot.src
            ? (
              <button key={screenshots.indexOf(screenshot)} type="button">
                <img src={screenshot.src} className="screenshots-img" alt="screenshot" />
              </button>
            )
            : null
        ))}
      </div>
      <Footer />
    </div>
  );
}

export default LiveStreamer;
