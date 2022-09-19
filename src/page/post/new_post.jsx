import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/header/header';
import CreatePost from '../../components/post/create';
import Footer from '../../components/footer/footer';
import constants from '../../global/constants';

function NewPost() {
  const navigate = useNavigate();
  const [post, setPost] = useState({
    title: '',
    subtitle: '',
    content: '',
  });
  const [content, setContent] = useState('');

  const postPost = () => {
    axios.post(constants.CREATE_POST_API, { data: post }, {
      headers: {
        authorization: window.localStorage.getItem('JWT'),
      },
    })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    setPost({ ...post, content });
  }, [content]);

  useEffect(() => {
    console.log('start useEffect');
    const jwt = window.localStorage.getItem('JWT');
    if (!jwt) {
      navigate('/user/login');
    }
  }, []);
  return (
    <>
      <Header />
      <CreatePost
        post={post}
        setPost={setPost}
        postPost={postPost}
        setContent={setContent}
      />
      <Footer />
    </>
  );
}

export default NewPost;
