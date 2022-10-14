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
  const [postId, setPostId] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [content, setContent] = useState('');
  const [post, setPost] = useState({
    title: '',
    subtitle: '',
    content: '',
  });

  function validation() {
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
    return 0;
  }

  const postPost = () => {
    validation();
    return axios.post(constants.CREATE_POST_API, { data: post }, {
      headers: {
        authorization: window.localStorage.getItem('JWT'),
      },
    })
      .then((res) => {
        window.localStorage.setItem('JWT', res.data.data.token);
        navigate(`/post/${res.data.data.id}`);
      })
      .catch((err) => {
        if (err.response.status === 403) {
          window.localStorage.removeItem('JWT');
          navigate('/user/login');
        }
      });
  };

  const updatePost = () => {
    validation();
    return axios.patch(`${constants.UPDATE_POST_API}/${postId}`, {
      postId, title: post.title, subtitle: post.subtitle, content: post.content,
    }, {
      headers: {
        authorization: window.localStorage.getItem('JWT'),
      },
    })
      .then(() => {
        Swal.fire({
          title: 'Success!',
          text: 'Updated post successful',
          icon: 'success',
          confirmButtonText: 'OK',
        });
        navigate(`/post/${postId}`);
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 403) {
          window.localStorage.removeItem('JWT');
          navigate('/user/login');
        }
      });
  };

  useEffect(() => {
    setPost({ ...post, content });
  }, [content]);

  useEffect(() => {
    // console.log('start useEffect');
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
        updatePost={updatePost}
        content={content}
        setContent={setContent}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
        setPostId={setPostId}
      />
      <Footer />
    </>
  );
}

export default NewPost;
