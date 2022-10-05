import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  //  ImageList, ImageListItem,
} from '@mui/material';
import Swal from 'sweetalert2';
import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';
import Editor from '../../components/editor/editor';
import Streamer from '../../components/video/streamer';
import Chatroom from '../../components/chatroom/chatroom';
import constants from '../../global/constants';
import './streamer.css';

function LiveStreamer({ socket, room, setRoom }) {
  const params = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState('');
  const [liveData, setLiveData] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [mode, setMode] = useState('javascript');
  const [version, setVersion] = useState([]);
  const [code, setCode] = useState("//Javascript\nconsole.log('Hello Javascript!');");
  const [tag, setTag] = useState([]);
  const [from, setFrom] = useState('');
  const [isFrom, setIsFrom] = useState(false);
  const [viewers, setViewers] = useState([]);
  const [isShow, setIsShow] = useState(true);
  const editor = useRef();
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
      axios.post(`${constants.GET_CODE_API}/${room}`, newTag)
        .then((res) => {
          socket.emit('addTag', newTag);
          console.log(res);
          Swal.fire({
            title: 'Success!',
            text: '直播版本成功',
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: 'var(--main-button-color)',
          });
          setTag('');
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

  // Get newest version
  const getNewestVersion = () => {
    console.log(version);
    if (version.length > 0) {
      console.log(version[version.length - 1]);
      axios.get(`${constants.GET_VERSION_API}/${room}?tag=${version[version.length - 1].version}`)
        .then((res) => {
          if (mode !== res.data.data.language) {
            setMode(res.data.data.language);
          }
          setCode(res.data.data.tags[0].code);
        })
        .catch((err) => console.log(err));
    }
  };

  const handleShow = () => {
    setIsShow(!isShow);
  };

  function getProfile() {
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
        if (err.response.status === 403 || err.response.status === 400) {
          window.localStorage.removeItem('JWT');
          navigate('/user/login');
        }
      });
  }

  function getLive() {
    axios.get(`${constants.GET_LIVE_API}?id=${room}`)
      .then((res) => {
        console.log(res.data);

        setLiveData(res.data.liveData);
      }).catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    getProfile();
    setRoom(params.id);
  }, []);

  useEffect(() => {
    if (socket && userData) {
      socket.emit('join', room, userData.name);
    }
  }, [socket, userData]);

  useEffect(() => {
    if (room) {
      getLive();
    }
  }, [room]);

  useEffect(() => {
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
    socket.on('leave', (id) => {
      const array = viewers.filter((viewer) => viewer.id !== id);
      setViewers(array);
    });
  }, [socket, viewers]);

  return (
    <>
      <Header />
      <section id="streamer-container">
        <div id="live-title">
          <div id="live-title-container">
            <h1 style={{ paddingLeft: 10 }}>
              {liveData ? `LIVE TITLE | ${liveData.title}` : null}
            </h1>
            {isStreaming && (
            <div className="streamer-streaming-icon">
              <div className="streamer-streaming-dot" />
              <p className="streamer-streaming-text">Live</p>
            </div>
            )}
          </div>
          <button id="streamer-hide-btn" type="button" onClick={handleShow}>
            {isShow ? 'CLICK TO HIDE VIDEO & CHAT' : 'CLICK TO SHOW VIDEO & CHAT' }
          </button>
        </div>
        <div id="streamer-header-container" style={isShow ? { display: 'flex' } : { display: 'none' }}>
          <div id="streamer-video-container">
            <Streamer
              socket={socket}
              room={room}
              localVideo={localVideo}
              setIsStreaming={setIsStreaming}
              tag={tag}
              setTag={setTag}
              addTag={addTag}
              isStreamer={isStreamer}
              userData={userData}
            />
            <p id="viewers-list-hint">
              Click : Get viewer editor code
              <br />
              <br />
              Newest : Get newest version
            </p>
            <div id="viewers-list">
              <Button
                variant="contained"
                type="button"
                color="error"
                onClick={getNewestVersion}
                className="viewers-list-btn"
              >
                newest
              </Button>
              {viewers.map((viewer) => (
                <Button
                  variant="contained"
                  type="button"
                  value={viewer.id}
                  key={viewer.id}
                  onClick={getViewerCode}
                  className="viewers-list-btn"
                >
                  {viewer.name}
                </Button>
              ))}
            </div>
          </div>
          <div id="editor-chatroom">
            <Chatroom
              socket={socket}
              room={room}
              userData={userData}
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
          />
        </div>

      </section>
      <Footer />
    </>
  );
}

export default LiveStreamer;
