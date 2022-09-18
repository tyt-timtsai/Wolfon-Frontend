import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card, CardContent, Typography,
} from '@mui/material';
import './post_list.css';

function PostButton({ post }) {
  const navigate = useNavigate();

  const cardStyle = {
    minWidth: 275,
    backgroundColor: 'var(--secondary-bg-color)',
    color: 'var(--main-content-color)',
  };

  const subtitleStyle = {
    color: 'var(--main-content-color)',
    fontSize: 14,
  };

  const typographyStyle = {
    color: 'var(--main-content-color)',
    mb: 1.5,
  };

  return (
    <Card className="post-list-cards" sx={cardStyle} key={post.id} onClick={() => navigate(`/post/${post.id}`)}>
      <CardContent>
        <Typography sx={subtitleStyle} gutterBottom>
          {post.subtitle}
        </Typography>
        <Typography variant="h5" component="div">
          {post.title}
        </Typography>
        <Typography sx={typographyStyle}>
          author :
          {' '}
          {post.user_id}
        </Typography>
        <Typography sx={typographyStyle}>
          fellowers :
          {' '}
          {post.fellowers.length}
        </Typography>
        <Typography sx={typographyStyle}>
          likes :
          {' '}
          {post.likes.length}
        </Typography>
        <Typography sx={typographyStyle}>
          views :
          {' '}
          {post.view}
        </Typography>
        <Typography sx={typographyStyle}>
          last update :
          {' '}
          {post.updated_dt.slice(0, -4)}
        </Typography>
        <Typography variant="body2">
          comments :
          {' '}
          {post.comments.length > 0 ? post.comments : 'No comment'}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default PostButton;
