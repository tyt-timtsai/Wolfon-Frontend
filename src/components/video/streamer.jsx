import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import Uploader from '../../global/uploader';

// let socket;
function Streamer({
  socket, room, localVideo, setIsStreaming,
}) {
  const [localStream, setLocalStream] = useState();
  const [record, setRecord] = useState();
  const [file, setFile] = useState();
  const [mediaRecorder, setMediaRecorder] = useState();
  const [chunks, setChunks] = useState([]);
  const [progress, setProgress] = useState(0);
  const download = useRef();
  const PCs = {};
  let stream;

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
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44100,
      },
    };
    stream = await navigator.mediaDevices.getDisplayMedia(constraints);
    setLocalStream(stream);
    localVideo.current.srcObject = stream;
  }

  async function createCameraStream() {
    const constraints = {
      video: {
        cursor: 'always',
      },
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44100,
      },
    };
    stream = await navigator.mediaDevices.getUserMedia(constraints);
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
      console.log(pc);
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
  // 開始錄影
  const startRecord = () => {
    let recorder;
    const options = {
      mimeType: 'video/webm;codecs=vp9',
    };

    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      console.error(`${options.mimeType} is not supported!`);
      return;
    }
    if (localStream) {
      try {
        // mediaRecorder = new MediaRecorder(localStream, options);
        recorder = new MediaRecorder(localStream, options);
        setMediaRecorder(recorder);
      } catch (err) {
        console.error('Failed to create MediaRecorder:', err);
        return;
      }

      // mediaRecorder.ondataavailable = (e) => {
      recorder.ondataavailable = (e) => {
        if (e && e.data && e.data.size > 0) {
          setChunks((prev) => [...prev, e.data]);
        }
      };
      // mediaRecorder.start(10);
      recorder.start(10);
      // console.log(mediaRecorder.state);
      console.log(recorder.state);
      console.log('recorder started');
    } else {
      console.log('Please start streaming first.');
    }
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
    console.log('in stopRecord', mediaRecorder);
    if (mediaRecorder) {
      mediaRecorder.stop();
      console.log(mediaRecorder.state);
      console.log('recorder stopped');
      // const blob = new Blob(buffer, { type: 'video/webm' });
      const blob = new Blob(chunks, { type: 'video/webm' });
      downloadRecord(blob);
      setFile(blob);
    } else {
      console.log('Video is not recording.');
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
    }
  };

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
            console.log(`${percentage}%`);
          }
        })
        .onError((error) => {
          setFile(undefined);
          console.error(error);
        });

      upload.start();
    }
  }, [file]);

  /**
 * 初始化
 */
  const init = () => {
    stopStream();
    createStream();
    connectIO();
    setIsStreaming(true);
    startRecord();
  };

  const initCamera = async () => {
    stopStream();
    await createCameraStream();
    connectIO();
    setIsStreaming(true);
  };

  useEffect(() => {
    console.log(localStream);
    if (localStream) {
      startRecord();
    }
  }, [localStream]);

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
        {record ? (
          <Stack spacing={2} direction="row">
            <CircularProgress variant="determinate" value={progress} />
            {progress}
          </Stack>
        ) : null}
        <Button variant="contained" type="button" onClick={init}>開始直播</Button>
        <Button variant="contained" type="button" onClick={initCamera}>開啟鏡頭</Button>
        <Button variant="contained" type="button" onClick={stopStream}>結束直播</Button>
        {record ? (
          <a id="stream-download" ref={download} href={record.href} download={record.filename} style={{ display: 'block' }}>Download</a>
        ) : null}

        {/* <form onSubmit={uploadVideo}>
        <input type="file" name="video" id="upload" onChange={handleUpload} />
        <button type="submit">Submit</button>
      </form> */}
      </div>

    </section>
  );
}

export default Streamer;
