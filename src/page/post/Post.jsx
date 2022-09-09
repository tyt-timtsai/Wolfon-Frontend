import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import constants from '../../global/constants';
import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';

function Post() {
  const location = useLocation();
  const [post, setPost] = useState();

  useEffect(() => {
    axios.get(`${constants.SERVER_URL}/api/v1${location.pathname}`)
      .then((res) => {
        setPost(res.data.data.value);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <div>
      <Header />
      <h1>Post</h1>
      {post ? (
        <div>
          <p>{post.id}</p>
          <p>{post.title}</p>
          <p>{post.subtitle}</p>
          <p>{post.content}</p>
          <ul>
            fellowers :
            {' '}
            {post.fellowers.map((fellower) => (
              <li key={fellower}>{fellower}</li>
            ))}
          </ul>
          <ul>
            likes :
            {' '}
            {post.likes.map((like) => (
              <li key={like}>{like}</li>
            ))}
          </ul>
          <p>
            update :
            {' '}
            {post.updated_dt}
          </p>
        </div>
      ) : <p> Not Found</p>}
      <Footer />
    </div>
  );
}

export default Post;
