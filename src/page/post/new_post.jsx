import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import validator from 'validator';

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
    if (validator.isEmpty(post.title)) {
      return Swal.fire({
        title: 'Error!',
        text: 'Required : Title ',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
    if (validator.isEmpty(post.subtitle)) {
      return Swal.fire({
        title: 'Error!',
        text: 'Required : Subtitle',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
    if (validator.isEmpty(post.content)) {
      return Swal.fire({
        title: 'Error!',
        text: '請先填寫文章內容',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
    return axios.post(constants.CREATE_POST_API, { data: post }, {
      headers: {
        authorization: window.localStorage.getItem('JWT'),
      },
    })
      .then((res) => {
        window.localStorage.setItem('JWT', res.data.data.token);
        navigate(`/post/${res.data.data.id}`);
      })
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
