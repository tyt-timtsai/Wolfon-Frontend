import './App.css';
import './global.css';
import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import io from 'socket.io-client';
import constants from './global/constants';
import Home from './page/Home';
import Search from './page/Search';
// Live
import LiveViewer from './page/live/viewer';
import LiveStreamer from './page/live/streamer';
import LiveReview from './page/live/review';
// User
import Login from './page/user/login';
import UserAsset from './page/user/userAsset';
import Profile from './page/user/profile';
// Post
import Post from './page/post/Post';
import NewPost from './page/post/new_post';
// Community
import Community from './page/community/Community';
// 404 Page
import NotFoundPage from './page/404';

const socket = io(constants.SOCKET_URL);

function App() {
  const [room, setRoom] = useState();
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
            room={room}
            setRoom={setRoom}
          />
        )}
        path="/live/:id"
      />

      <Route
        element={(
          <LiveReview
            socket={socket}
            room={room}
            setRoom={setRoom}
          />
        )}
        path="/live/review/:id"
      />

      <Route
        element={(
          <LiveStreamer
            socket={socket}
            room={room}
            setRoom={setRoom}
          />
        )}
        path="/live/streamer/:id"
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
          <Profile
            socket={socket}
          />
        )}
        path="/user/:id"
      />

      <Route
        element={(
          <UserAsset
            socket={socket}
          />
        )}
        path="/user/asset/:id"
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
          <NewPost
            socket={socket}
          />
        )}
        path="/post/edit/:id"
      />

      <Route
        element={(
          <Community
            socket={socket}
          />
        )}
        path="/community/:id"
      />

      <Route
        element={(
          <NotFoundPage />
        )}
        path="*"
      />
    </Routes>
  );
}

export default App;
