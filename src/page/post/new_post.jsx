import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/header/header';
import CreatePost from '../../components/post/create';
import Footer from '../../components/footer/footer';

function NewPost() {
  const navigate = useNavigate();
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
      <CreatePost />
      <Footer />
    </>
  );
}

export default NewPost;
