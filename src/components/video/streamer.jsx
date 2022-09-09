import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';

// let socket;
function Streamer({
  socket, room, localVideo, setIsStreaming, screenShot,
}) {
  const [localStream, setLocalStream] = useState();
  const PCs = {};
  let stream;

  // ===================== 連線相關 =====================

  /**
 * 取得本地串流
 */
  async function createStream() {
    const constraints = {
      audio: false,
      video: true,
    };
    // const stream = await navigator.mediaDevices.getUserMedia(constraints)
    stream = await navigator.mediaDevices.getDisplayMedia(constraints);
    // localStream = stream;
    setLocalStream(stream);
    localVideo.current.srcObject = stream;
  }

  async function createCameraStream() {
    const constraints = {
      audio: false,
      video: true,
    };

    // const constraints = {
    //   video: {
    //     cursor: "always"
    //   },
    //   audio: {
    //     echoCancellation: true,
    //     noiseSuppression: true,
    //     sampleRate: 44100
    //   }
    // }
    stream = await navigator.mediaDevices.getUserMedia(constraints);
    // localStream = stream;
    setLocalStream(stream);
    localVideo.current.srcObject = stream;
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
    const peerConn = new RTCPeerConnection(configuration);

    // 增加本地串流
    localStream.getTracks().forEach((track) => {
      peerConn.addTrack(track, localStream);
    });

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
        console.log('remote disconnected');
      }
    };

    return peerConn;
  }

  /**
 * 處理信令
 * @param {Boolean} isOffer 是 offer 還是 answer
 */
  async function sendSDP(isOffer, pc) {
    if (!pc) {
      initPeerConnection();
    }

    // 創建SDP信令
    const localSDP = await pc[isOffer ? 'createOffer' : 'createAnswer']({
      offerToReceiveAudio: true, // 是否傳送聲音流給對方
      offerToReceiveVideo: true, // 是否傳送影像流給對方
    });

    // 設定本地SDP信令
    await pc.setLocalDescription(localSDP);

    // 寄出SDP信令
    const event = isOffer ? 'offer' : 'answer';
    socket.emit(event, room, pc.localDescription);
  }

  /**
   * 連線 socket.io
   */
  function connectIO() {
    socket.emit('join', room);

    socket.on('ice_candidate', async (data, id) => {
      console.log('收到 ice_candidate');
      const candidate = new RTCIceCandidate({
        sdpMLineIndex: data.label,
        candidate: data.candidate,
      });
      await PCs[id].addIceCandidate(candidate);
    });

    socket.on('offer', async (desc, id) => {
      console.log('收到 offer');
      const pc = initPeerConnection();
      PCs[id] = pc;
      // 設定對方的配置
      await pc.setRemoteDescription(desc);

      // 發送 answer
      await sendSDP(false, pc);
    });

    socket.on('bye', async (id) => {
      console.log(id, '中斷連線');
      delete PCs[id];
    });
  }

  /**
   * 直播功能
   */
  const buffer = [];
  let mediaRecorder;
  const startRecord = () => {
    const options = {
      mimeType: 'video/webm;codecs=vp9',
    };

    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      console.error(`${options.mimeType} is not supported!`);
      return;
    }

    try {
      mediaRecorder = new MediaRecorder(localStream, options);
    } catch (err) {
      console.error('Failed to create MediaRecorder:', err);
      return;
    }

    mediaRecorder.ondataavailable = (e) => {
      if (e && e.data && e.data.size > 0) {
        buffer.push(e.data);
      }
    };
    mediaRecorder.start(10);
    console.log(mediaRecorder.state);
    console.log('recorder started');
  };

  // 停止錄影
  const stopRecord = () => {
    mediaRecorder.stop();
    console.log(mediaRecorder.state);
    console.log('recorder stopped');
  };

  const stopStream = async () => {
    if (mediaRecorder) {
      stopRecord();
    }
    if (localVideo.current.srcObject != null) {
      const tracks = localVideo.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      localVideo.current.srcObject = null;
    }
  };

  /**
 * 初始化
 */
  const init = async () => {
    await stopStream();
    await createStream();
    connectIO();
    setIsStreaming(true);
  };

  const initCamera = async () => {
    await stopStream();
    await createCameraStream();
    connectIO();
    setIsStreaming(true);
  };

  useEffect(() => {
    console.log('socket');
    // socket = io('ws://localhost:3000');
    // socket = io('wss://timtsai.website');
    return (() => socket.close());
  }, [socket]);

  return (
    <section id="streamer-video">
      <video
        ref={localVideo}
        height="auto"
        id="localVideo"
        muted
        autoPlay
        playsInline
        controls
      >
        Your browser does not support the video tag.
      </video>
      <Button variant="contained" type="button" onClick={init}>開始直播</Button>
      <Button variant="contained" type="button" onClick={stopStream}>關閉畫面</Button>
      <Button variant="contained" type="button" onClick={initCamera}>開啟鏡頭</Button>
      <Button variant="contained" type="button" id="screenshot-btn" onClick={screenShot}> 直播畫面截圖 </Button>
      <Button variant="contained" type="button" onClick={startRecord}>開始錄影</Button>
      <Button variant="contained" type="button" onClick={stopRecord}>停止錄影</Button>
    </section>
  );
}

export default Streamer;
