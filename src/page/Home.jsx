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

  useEffect(() => {
    axios.get(`${constants.SERVER_URL}/api/v1/post/all`)
      .then((res) => {
        setPosts(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <Header />
      <div id="home-container">
        <Sidebar />
        <div id="posts-container">
          {posts.reverse().map((post) => (
            <PostList
              key={post.id}
              post={post}
            />
          ))}
        </div>
        <div className="home-sidebar" id="home-right-sidebar">
          sidebar
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Home;
