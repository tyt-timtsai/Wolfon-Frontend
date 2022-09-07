import './App.css';
import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import io from 'socket.io-client';
import LiveViewer from './page/live/viewer';
import LiveStreamer from './page/live/streamer';
import Login from './page/user/login';
import NewPost from './page/post/new_post';
import constants from './global/constants';

function App() {
  const socket = io(constants.SOCKET_URL);
  useEffect(() => () => socket.disconnect(), [socket]);
  return (
    <Routes id="App">
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

      <Route
        element={(
          <Login
            socket={socket}
          />
        )}
        path="/user/login"
      />

      <Route
        element={(
          <NewPost
            socket={socket}
          />
        )}
        path="/post/create"
      />
    </Routes>
  );
}

export default App;
