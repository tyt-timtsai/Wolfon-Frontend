import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/header/header';
import Footer from '../components/footer/footer';
import PostButton from './post/Post_button';
import constants from '../global/constants';

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
    <div>
      <Header />
      <div id="home-container">
        <h1>Home</h1>
        {posts.map((post) => (
          <PostButton
            key={post.id}
            post={post}
          />
        ))}
      </div>
      <Footer />
    </div>
  );
}

export default Home;
