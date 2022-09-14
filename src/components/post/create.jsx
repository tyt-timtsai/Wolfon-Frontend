import React, { useState } from 'react';
import axios from 'axios';
import constants from '../../global/constants';

function CreatePost() {
  const [post, setPost] = useState({
    title: '',
    subtitle: '',
    content: '',
  });

  const handleInputChange = (prop) => (e) => {
    setPost({ ...post, [prop]: e.target.value });
  };

  const postPost = () => {
    axios.post(`${constants.SERVER_URL}/api/v1/post`, { data: post }, {
      headers: {
        authorization: window.localStorage.getItem('JWT'),
      },
    })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  return (
    <div id="create-post-container">
      <p>text</p>
      <button type="button">change text</button>
      <input type="text" id="create-post-title" value={post.title} onChange={handleInputChange('title')} placeholder="Title" />
      <input type="text" id="create-post-subtitle" value={post.subtitle} onChange={handleInputChange('subtitle')} placeholder="Subtitle" />
      <textarea type="text" id="create-post-content" value={post.content} onChange={handleInputChange('content')} placeholder="Content" />
      <button type="button" onClick={postPost}>Submit</button>
    </div>
  );
}

export default CreatePost;
