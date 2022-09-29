import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';
import Editor from '../../components/editor/editor';
import Video from '../../components/video/video';
import Chatroom from '../../components/chatroom/chatroom';
import './viewer.css';
import constants from '../../global/constants';

function LiveViewer({ socket, room, setRoom }) {
  const editor = useRef();
  const params = useParams();
  const navigate = useNavigate();
  const [mode, setMode] = useState('javascript');
  const [version, setVersion] = useState([]);
  const [code, setCode] = useState("//Javascript\nconsole.log('Hello Javascript!');");
  const [isComplier, setIsComplier] = useState(true);
  const [isConnect, setIsConnect] = useState(false);
  const [userData, setUserData] = useState(null);

  const handleChange = () => {
    setIsComplier(!isComplier);
  };

  useEffect(() => {
    console.log(params.id);
    const token = window.localStorage.getItem('JWT');
    if (!token) {
      navigate('/user/login');
    }
    axios.get(constants.PROFILE_API, {
      headers: {
        authorization: token,
      },
    }).then((res) => {
      console.log(res);
      setUserData(res.data.data);
    }).catch((err) => {
      console.log(err);
      if (err.response.status === 403 || err.response.status === 401) {
        navigate('/user/login');
      }
    });
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
              Editor
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
              userData={userData}
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default LiveViewer;
