import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/header/header';
import Sidebar from '../components/sidebar/sidebar';
import Footer from '../components/footer/footer';
import PostList from '../components/post/Post_list';
import constants from '../global/constants';
import './home.css';

function Home() {
  // Home
  const [posts, setPosts] = useState([]);
  const [userData, setUserData] = useState(null);
  const token = window.localStorage.getItem('JWT');

  useEffect(() => {
    axios.get(constants.GET_ALL_POST_API)
      .then((res) => {
        console.log(res.data.data);
        setPosts(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
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
        });
    }
  }, []);

  return (
    <>
      <Header />
      <div id="home-container">
        {userData ? (
          <Sidebar
            userData={userData}
          />
        ) : null}
        <div id="posts-container">
          {posts.reverse().map((post) => (
            <PostList
              // eslint-disable-next-line no-underscore-dangle
              key={post._id}
              post={post}
            />
          ))}
        </div>
        {/* <div className="home-sidebar" id="home-right-sidebar">
          sidebar
        </div> */}
      </div>
      <Footer />
    </>
  );
}

export default Home;
