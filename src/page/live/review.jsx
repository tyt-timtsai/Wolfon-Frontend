import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';
import Editor from '../../components/editor/editor';
import './viewer.css';
import constants from '../../global/constants';

function LiveReview({ socket, room, setRoom }) {
  const editor = useRef();
  const params = useParams();
  const [mode, setMode] = useState('javascript');
  const [version, setVersion] = useState([]);
  const [code, setCode] = useState("//Javascript\nconsole.log('Hello Javascript!');");
  const [liveData, setLiveData] = useState(null);

  useEffect(() => {
    axios.get(`${constants.GET_LIVE_API}?id=${params.id}`).then((res) => {
      setLiveData(res.data.liveData);
    }).catch((err) => {
      console.log(err);
    });
    setRoom(params.id);
  }, []);

  return (
    <>
      <Header />

      <div id="viewer-container">
        <div
          id="viewer-video-container"
        >
          <section id="video-container">
            {liveData
            && (
            <video
              height="auto"
              style={{
                backgroundColor: 'black',
              }}
              id="video"
              muted
              autoPlay
              playsInline
              controls
              src={liveData.video_url}
            >
              Your browser does not support the video tag.
            </video>
            )}
          </section>
        </div>
        <div id="veiwer-side-container">
          <div id="viewer-btns-container">
            <button
              type="button"
              className="viewer-btns"
              style={{ color: 'var(--secondary-color)', cursor: 'default' }}
            >
              Editor
            </button>
          </div>
          <div id="viewer-editor-container">
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
        </div>
      </div>

      <Footer />
    </>
  );
}

export default LiveReview;
