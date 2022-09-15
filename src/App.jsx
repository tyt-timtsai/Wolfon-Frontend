import './App.css';
import './global.css';
import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import io from 'socket.io-client';
import constants from './global/constants';
import Home from './page/Home';
import Search from './page/Search';
import LiveList from './page/live/LiveList';
import LiveViewer from './page/live/viewer';
import LiveStreamer from './page/live/streamer';
import Login from './page/user/Login';
import Profile from './page/user/Profile';
import Post from './page/post/Post';
import NewPost from './page/post/New_post';
import Community from './page/community/Community';

function App() {
  const socket = io(constants.SOCKET_URL);
  const [room, setRoom] = useState();
  // useEffect(() => setRoom('room1'));
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
          <LiveList
            socket={socket}
            room={room}
          />
        )}
        path="/live"
      />

      <Route
        element={(
          <LiveViewer
            socket={socket}
            room={room}
          />
        )}
        path="/live/:id"
      />

      <Route
        element={(
          <LiveStreamer
            socket={socket}
            room={room}
            setRoom={setRoom}
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
