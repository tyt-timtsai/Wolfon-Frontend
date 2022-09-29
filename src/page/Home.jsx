import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Header from '../components/header/header';
import Sidebar from '../components/sidebar/sidebar';
import Footer from '../components/footer/footer';
import PostList from '../components/post/Post_list';
import constants from '../global/constants';
import './home.css';

function Home() {
  // Home
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [userData, setUserData] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const token = window.localStorage.getItem('JWT');

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

  return (
    <>
      <Header />
      <div id="home-container">
        {/* {userData ? ( */}
        <Sidebar
          userData={userData}
        />
        {/* ) : null} */}
        <div id="posts-container">

          {isFetching ? (
            <Box sx={{ display: 'flex', margin: 'auto', marginTop: 30 }}>
              <CircularProgress size={30} color="inherit" />
            </Box>
          ) : (
            <>
              {posts.reverse().map((post) => (
                <PostList
              // eslint-disable-next-line no-underscore-dangle
                  key={post._id}
                  post={post}
                />
              ))}
            </>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Home;
