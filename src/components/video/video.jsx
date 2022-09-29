import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import './video.css';
import axios from 'axios';
import constants from '../../global/constants';

// let socket;
function Video({
  socket, isConnect, setIsConnect, room,
}) {
  let peerConn;
  const navigate = useNavigate();
  const [userData, setUserData] = useState('');
  const localVideo = useRef();

  // ===================== 連線相關 =====================
  /**
 * 連線 socket.io
 */
  function connectIO() {
    socket.on('answer', async (desc) => {
      console.log('收到 answer');
      // 設定對方的配置
      await peerConn.setRemoteDescription(desc);
    });

    socket.on('ice_candidate', async (data) => {
      console.log('收到 ice_candidate');
      const candidate = new RTCIceCandidate({
        sdpMLineIndex: data.label,
        candidate: data.candidate,
      });
      await peerConn.addIceCandidate(candidate);
    });
  }

  /**
 * 初始化Peer連結
 */
  function initPeerConnection() {
    const configuration = {
      iceServers: [
        {
          urls: 'stun:stun.l.google.com:19302',
        },
      ],
    };
    peerConn = new RTCPeerConnection(configuration);

    peerConn.addTransceiver('video', { direction: 'recvonly' });
    peerConn.addTransceiver('audio', { direction: 'recvonly' });

    // 找尋到 ICE 候選位置後，送去 Server 與另一位配對
    peerConn.onicecandidate = (e) => {
      if (e.candidate) {
        console.log('發送 ICE');
        // 發送 ICE
        socket.emit('ice_candidate', room, {
          label: e.candidate.sdpMLineIndex,
          id: e.candidate.sdpMid,
          candidate: e.candidate.candidate,
        });
      }
    };

    // 監聽 ICE 連接狀態
    peerConn.oniceconnectionstatechange = (e) => {
      if (e.target.iceConnectionState === 'disconnected') {
        localVideo.current.srcObject = null;
      }
    };

    // 監聽是否有流傳入，如果有的話就顯示影像
    peerConn.ontrack = (data) => {
      // 接收流並顯示遠端視訊
      localVideo.current.srcObject = data.streams[0];
    };

    // 舊版，有些瀏覽器還沒換用新版的，要用這個
    // peerConn.onaddstream = (data) => {
    //   console.log('get');
    //   console.log(data.stream);
    //   localVideo.current.srcObject = data.stream;
    // };
  }

  /**
 * 處理信令
 * @param {Boolean} isOffer 是 offer 還是 answer
 */
  async function sendSDP(isOffer) {
    if (!peerConn) {
      initPeerConnection();
    }
    // 創建SDP信令
    const localSDP = await peerConn.createOffer();

    // 設定本地SDP信令
    await peerConn.setLocalDescription(localSDP);

    // 寄出SDP信令
    const event = isOffer ? 'offer' : 'answer';
    socket.emit(event, room, peerConn.localDescription);
  }

  /**
 * 初始化
 */
  const init = async () => {
    await initPeerConnection();
    await connectIO();
    await sendSDP(true);
    await setIsConnect(true);
  };

  // 取得使用者資料

  function getProfile() {
    axios.get(`${constants.PROFILE_API}`, {
      headers: {
        authorization: window.localStorage.getItem('JWT'),
      },
    })
      .then((res) => {
        console.log(res.data);
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

  useEffect(() => {
    if (userData) {
      socket.emit('join', room, userData.name);
    }
  }, [socket, userData]);

  useEffect(() => {
    console.log('start');
    getProfile();

    socket.on('test', (data, id) => {
      console.log(data);
      console.log(id);
    });

    return (() => {
      socket.close();
    });
  }, [socket]);

  return (
    <section id="video-container">
      <video
        ref={localVideo}
        height="auto"
        style={{
          backgroundColor: 'black',
        }}
        id="video"
        muted
        autoPlay
        playsInline
        controls
      >
        Your browser does not support the video tag.
      </video>
      <Button
        variant="contained"
        id="video-btn"
        type="button"
        onClick={init}
        style={isConnect ? { display: 'none' } : { display: 'block' }}
      >
        連接直播
      </Button>
    </section>
  );
}

export default Video;
