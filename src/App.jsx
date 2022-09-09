import './App.css';
import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import io from 'socket.io-client';
import constants from './global/constants';
import Home from './page/Home';
import Search from './page/Search';
import LiveViewer from './page/live/Viewer';
import LiveStreamer from './page/live/Streamer';
import Login from './page/user/Login';
import Profile from './page/user/Profile';
import Post from './page/post/Post';
import NewPost from './page/post/New_post';
import Community from './page/community/Community';

function App() {
  const socket = io(constants.SOCKET_URL);
  useEffect(() => () => socket.disconnect(), [socket]);
  return (
    <Routes id="App">
      <Route
        element={(
          <Home
            socket={socket}
          />
        )}
        path="/"
      />

      <Route
        element={(
          <Search
            socket={socket}
          />
        )}
        path="/search"
      />

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
          <Profile
            socket={socket}
          />
        )}
        path="/user/profile"
      />

      <Route
        element={(
          <Post
            socket={socket}
          />
        )}
        path="/post/:id"
      />

      <Route
        element={(
          <NewPost
            socket={socket}
          />
        )}
        path="/post/create"
      />

      <Route
        element={(
          <Community
            socket={socket}
          />
        )}
        path="/community/:id"
      />
    </Routes>
  );
}

export default App;
