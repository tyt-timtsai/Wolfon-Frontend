import React, { useState } from 'react';

function CreatePost() {
  const [post, setPost] = useState({
    title: '',
    subtitle: '',
    content: '',
  });

  const handleInputChange = (prop) => (e) => {
    setPost({ ...post, [prop]: e.target.value });
  };

  return (
    <div id="create-post-container">
      <p>text</p>
      <button type="button">change text</button>
      <input type="text" id="create-post-title" value={post.title} onChange={handleInputChange('title')} />
      <input type="text" id="create-post-subtitle" value={post.subtitle} onChange={handleInputChange('subtitle')} />
      <input type="text" id="create-post-content" value={post.content} onChange={handleInputChange('content')} />
    </div>
  );
}

export default CreatePost;
