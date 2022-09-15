import React, { useState } from 'react';
import axios from 'axios';
import parser from 'html-react-parser';
import { TextField, Button } from '@mui/material';
import constants from '../../global/constants';
import Tiptap from './TipTap';
import './create.css';

function CreatePost() {
  const [preview, setPreview] = useState(false);
  const [post, setPost] = useState({
    title: '',
    subtitle: '',
    content: '',
  });

  const handleInputChange = (prop) => (e) => {
    setPost({ ...post, [prop]: e.target.value });
  };

  const handlePreview = () => {
    setPreview(!preview);
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
      <div id="title-inputs-container">
        <TextField
          required
          label="Title"
          size="small"
          variant="outlined"
          type="text"
          name="title"
          id="create-post-title"
          onChange={handleInputChange('title')}
        />
        <TextField
          required
          label="Subtitle"
          size="small"
          variant="outlined"
          type="text"
          name="subTitle"
          id="create-post-subtitle"
          fullWidth
          onChange={handleInputChange('subtitle')}
        />
      </div>
      <Tiptap
        post={post}
        setPost={setPost}
      />
      <div id="create-post-button-container">
        <Button type="button" variant={preview ? 'contained' : 'outlined'} onClick={handlePreview}>{preview ? 'Close' : 'Preview'}</Button>
        <Button type="button" variant="contained" onClick={postPost}>Submit</Button>
      </div>
      { preview
        ? (
          <div className="ProseMirror">
            {parser(post.content)}
          </div>
        )
        : null }
    </div>
  );
}

export default CreatePost;
