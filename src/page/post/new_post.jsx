import React, { useEffect } from 'react';
import Header from '../../components/header/header';
import CreatePost from '../../components/post/create';
import Footer from '../../components/footer/footer';

function NewPost() {
  useEffect(() => {
    console.log('start useEffect');
    let a = false;
    console.log(a);
    return (() => {
      console.log('in return');
      a = true;
      console.log(a);
    });
  }, []);
  return (
    <div id="new-post-container">
      <Header />
      <CreatePost />
      <Footer />
    </div>
  );
}

export default NewPost;
