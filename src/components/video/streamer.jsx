import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import Uploader from '../../global/uploader';

function Streamer({
  socket, room, localVideo, setIsStreaming,
}) {
  let stream;
  const PCs = {};
  const download = useRef();
  const [file, setFile] = useState();
  const [record, setRecord] = useState();
  const [chunks, setChunks] = useState([]);
  const [progress, setProgress] = useState(0);
  const [localStream, setLocalStream] = useState();
  const [mediaRecorder, setMediaRecorder] = useState();
  const [isEnd, setIsEnd] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [peerConnections, setPeerConnections] = useState({});

  // ===================== 連線相關 =====================

  /**
 * 取得本地串流
 */
  async function createStream() {
    const constraints = {
      video: {
        cursor: 'always',
      },
      audio: {
        autoGainControl: true,
        sampleSize: 16,
        channelCount: 2,
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44100,
      },
    };

    stream = await navigator.mediaDevices.getDisplayMedia(constraints);

    if (!localStream) {
      const audioStream = await navigator.mediaDevices.getUserMedia(
        { audio: true },
      ).catch((err) => { console.log(err); });
      const [audioTrack] = audioStream.getAudioTracks();
      stream.addTrack(audioTrack);
    }

    if (localStream) {
      const track = stream.getVideoTracks()[0];
      const peerConns = Object.values(peerConnections);
      peerConns.forEach((pc) => {
        const sender = pc.getSenders().find((s) => s.track.kind === track.kind);
        sender.replaceTrack(track);
      });
    }

    setLocalStream(stream);
    localVideo.current.srcObject = stream;
  }

  async function createCameraStream() {
    const constraints = {
      video: {
        cursor: 'always',
      },
      audio: {
        autoGainControl: true,
        sampleSize: 16,
        channelCount: 2,
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44100,
      },
    };

    stream = await navigator.mediaDevices.getUserMedia(constraints);

    if (localStream) {
      const track = stream.getVideoTracks()[0];
      const peerConns = Object.values(peerConnections);
      peerConns.forEach((pc) => {
        const sender = pc.getSenders().find((s) => s.track.kind === track.kind);
        sender.replaceTrack(track);
      });
    }

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
    stream.getTracks().forEach((track) => {
      peerConn.addTrack(track, stream);
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
        // console.log('remote disconnected');
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
    socket.on('ice_candidate', async (data, id) => {
      // console.log('收到 ice_candidate');
      const candidate = new RTCIceCandidate({
        sdpMLineIndex: data.label,
        candidate: data.candidate,
      });
      await PCs[id].addIceCandidate(candidate);
    });

    socket.on('offer', async (desc, id) => {
      // console.log('收到 offer');
      const pc = initPeerConnection();
      PCs[id] = pc;
      setPeerConnections(PCs);
      // 設定對方的配置
      await pc.setRemoteDescription(desc);

      // 發送 answer
      await sendSDP(false, pc);
    });
    setIsConnected(true);
  }

  /**
   * 直播功能
   */
  // 開始錄影
  const startRecord = () => {
    let recorder;
    const options = {
      mimeType: 'video/webm',
    };

    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      console.error(`${options.mimeType} is not supported!`);
      return;
    }
    if (localStream) {
      try {
        recorder = new MediaRecorder(localStream, options);
        setMediaRecorder(recorder);
      } catch (err) {
        console.error('Failed to create MediaRecorder:', err);
        return;
      }

      recorder.ondataavailable = (e) => {
        if (e && e.data && e.data.size > 0) {
          setChunks((prev) => [...prev, e.data]);
        }
      };
      recorder.start(10);
    } else {
      // console.log('Please start streaming first.');
    }
    setIsStreaming(true);
  };

  // 下載錄影
  const downloadRecord = async (blob) => {
    const url = window.URL.createObjectURL(blob);

    setRecord({
      href: url,
      filename: 'record.webm',
    });
    setChunks('1');
  };

  // 停止錄影
  const stopRecord = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      const blob = new Blob(chunks, { type: 'video/webm' });
      downloadRecord(blob);
      setFile(blob);
    } else {
      // console.log('Video is not recording.');
    }
  };

  // 停止直播
  const stopStream = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      stopRecord();
    }
    if (localVideo.current.srcObject != null) {
      const tracks = localVideo.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      localVideo.current.srcObject = null;
      setIsEnd(true);
      setIsStreaming(false);
      const blob = new Blob(chunks, { type: 'video/webm' });
      localVideo.current.src = URL.createObjectURL(blob);
    }
  };

  /**
 * 初始化
 */
  const init = () => {
    createStream();
    if (!isConnected) {
      connectIO();
    }
    if (!mediaRecorder) {
      startRecord();
    }
  };

  const initCamera = async () => {
    await createCameraStream();
    if (!isConnected) {
      connectIO();
    }
    if (!mediaRecorder) {
      startRecord();
    }
  };

  // 有影音流就開始錄影
  useEffect(() => {
    if (localStream) {
      startRecord();
    }
  }, [localStream]);

  // 結束直播時上傳錄影
  useEffect(() => {
    if (file) {
      const option = {
        fileName: `lives/${room}/record`,
        file,
      };

      let percentage;

      const upload = new Uploader(option);
      upload.room = room;

      upload
        .onProgress(({ percentage: newPercentage }) => {
          // to avoid the same percentage to be logged twice
          if (newPercentage !== percentage) {
            percentage = newPercentage;
            setProgress(percentage);
            // console.log(`${percentage}%`);
          }
        })
        .onError((error) => {
          setFile(undefined);
          console.error(error);
        });

      upload.start();
    }
  }, [file]);

  // 觀看者離開時刪除 Peer
  useEffect(() => {
    socket.on('leave', async (id) => {
      // console.log(peerConnections);

      setPeerConnections((current) => {
        const copy = { ...current };
        delete copy[`${id}`];
        return copy;
      });
    });
    // console.log(peerConnections);
  }, [peerConnections]);

  useEffect(() => (() => socket.close()), [socket]);

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
      <div id="streamer-video-btns">
        {isEnd && <p>Live streaming end.</p>}
        {record ? (
          <Stack spacing={2} direction="row">
            <CircularProgress variant="determinate" value={progress} />
            {progress}
          </Stack>
        ) : null}
        {!isEnd && <Button variant="contained" type="button" onClick={init}>Share Screen</Button> }
        {!isEnd && <Button variant="contained" type="button" onClick={initCamera}>Camera</Button> }
        {localStream && <Button variant="contained" type="button" color="error" onClick={stopStream}>End Live Stream</Button>}
        {record ? (
          <a
            ref={download}
            href={record.href}
            id="stream-download"
            download={record.filename}
          >
            Download
          </a>
        ) : null}
      </div>

    </section>
  );
}

export default Streamer;
