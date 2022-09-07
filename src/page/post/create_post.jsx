import React, { useEffect, useState } from 'react';
import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';

function CreatePost() {
  const [text, setText] = useState('text');

  const onclick = () => {
    setText(text + 1);
  };

  useEffect(() => {
    console.log('start useEffect');
    let a = false;
    console.log(a);
    return (() => {
      console.log('in return');
      a = true;
      console.log(a);
    });
  }, [text]);
  return (
    <div>
      <Header />
      <h1>Posts</h1>
      <p>{text}</p>
      <button type="button" onClick={onclick}>change text</button>
      <Footer />
    </div>
  );
}

export default CreatePost;
