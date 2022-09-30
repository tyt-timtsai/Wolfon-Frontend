import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Header from '../components/header/header';
import Sidebar from '../components/sidebar/sidebar';
import Footer from '../components/footer/footer';
import PostList from '../components/post/Post_list';
import LiveListItem from '../components/video/LiveListItem';
import constants from '../global/constants';
import './home.css';

function Home() {
  // Home
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [lives, setLives] = useState([]);
  const [type, setType] = useState('post');
  const [userData, setUserData] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const token = window.localStorage.getItem('JWT');

  const handleType = (e) => {
    setType(e.target.value);
  };

  async function getPosts() {
    setIsFetching(true);
    try {
      const result = await axios.get(constants.GET_ALL_POST_API);
      setPosts(result.data.data);
    } catch (err) {
      console.log(err);
    }
    setIsFetching(false);
  }

  async function getLives() {
    setIsFetching(true);
    try {
      const result = await axios.get(constants.GET_LIVE_API);
      setLives(result.data.liveData);
    } catch (err) {
      console.log(err);
    }
    setIsFetching(false);
  }

  useEffect(() => {
    if (token) {
      axios.get(constants.PROFILE_API, {
        headers: {
          authorization: token,
        },
      })
        .then((res) => {
          console.log(res.data.data);
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

    getPosts();
  }, []);

  useEffect(() => {
    setPosts(null);
    setLives(null);
    if (type === 'post') {
      getPosts();
    }
    if (type === 'live') {
      getLives();
    }
  }, [type]);

  return (
    <>
      <Header />
      <div id="home-container">
        <Sidebar
          userData={userData}
        />
        <div id="content-container">
          <div id="home-type-btns">
            <button
              type="button"
              value="post"
              onClick={handleType}
              className="home-type-btn"
              style={type === 'post' ? { backgroundColor: 'var(--main-color)', color: 'var(--main-bg-color)' } : null}
            >
              Post
            </button>
            <button
              type="button"
              value="live"
              onClick={handleType}
              className="home-type-btn"
              style={type === 'live' ? { backgroundColor: 'var(--main-color)', color: 'var(--main-bg-color)' } : null}
            >
              Live
            </button>
          </div>
          {isFetching ? (
            <Box sx={{ display: 'flex', margin: 'auto', marginTop: 30 }}>
              <CircularProgress size={30} color="inherit" />
            </Box>
          ) : (
            <>
              {type === 'post' && posts && (
                <div id="posts-container">
                  {posts.reverse().map((post) => (
                    <PostList
                // eslint-disable-next-line no-underscore-dangle
                      key={post._id}
                      post={post}
                    />
                  ))}
                </div>
              )}
              {type === 'live' && lives && (
                <div id="lives-container">
                  {lives && lives.reverse().map((live) => (
                    <LiveListItem
                      live={live}
                    // eslint-disable-next-line no-underscore-dangle
                      key={live._id}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Home;
