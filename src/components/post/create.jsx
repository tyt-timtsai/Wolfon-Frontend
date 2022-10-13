import React, { useState } from 'react';
import parser from 'html-react-parser';
import { TextField, Button, Paper } from '@mui/material';
import Tiptap from './TipTap';
import './create.css';

function CreatePost({
  post, setPost, updatePost, postPost, content, setContent, isEdit, setIsEdit, setPostId,
}) {
  const [preview, setPreview] = useState(false);

  const handleInputChange = (prop) => (e) => {
    setPost({ ...post, [prop]: e.target.value });
  };

  const handlePreview = () => {
    setPreview(!preview);
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
          style={{ width: '400px' }}
          InputLabelProps={{
            style: { color: 'var(--main-content-color)' },
          }}
          onChange={handleInputChange('title')}
          value={post.title || ''}
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
          style={{ backgroundColor: 'var(--main-bg-color)' }}
          InputLabelProps={{
            style: { color: 'var(--main-content-color)' },
          }}
          onChange={handleInputChange('subtitle')}
          value={post.subtitle || ''}
        />
      </div>
      <Tiptap
        content={content}
        setContent={setContent}
        setPost={setPost}
        setIsEdit={setIsEdit}
        setPostId={setPostId}
      />
      <div id="create-post-button-container">
        <Button type="button" variant={preview ? 'contained' : 'outlined'} onClick={handlePreview}>{preview ? 'Close' : 'Preview'}</Button>
        {isEdit ? (
          <Button type="button" variant="contained" onClick={updatePost}>Update</Button>
        ) : (
          <Button type="button" variant="contained" onClick={postPost}>Submit</Button>
        )}
      </div>
      { preview && post.content
        ? (
          <Paper elevation={6} id="post-preview">
            <div id="post-detail-content-header">
              <h1>{post.title}</h1>
              <h3>{post.subtitle}</h3>
            </div>

            <hr style={{ width: '97%', border: '1px solid var(--third-color)' }} />

            <div className="ProseMirror">
              {parser(post.content)}
            </div>
          </Paper>
        )
        : null }
    </div>
  );
}

export default CreatePost;
