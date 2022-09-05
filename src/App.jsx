import './App.css';
import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import io from 'socket.io-client';
import LiveViewer from './page/viewer';
import LiveStreamer from './page/streamer';
import constants from './global/constants';

function App() {
  const socket = io(constants.SOCKET_URL);
  useEffect(() => () => socket.disconnect(), [socket]);
  return (
    <Routes>
      <Route
        element={(
          <LiveViewer
            socket={socket}
          />
        )}
        path="/live/viewer"
      />
      <Route
        element={(
          <LiveStreamer
            socket={socket}
          />
        )}
        path="/live/streamer"
      />
    </Routes>
  );
}

export default App;
