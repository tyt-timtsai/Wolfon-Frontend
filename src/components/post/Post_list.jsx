import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card, CardActions, CardContent, Button, Typography,
} from '@mui/material';
import './post_list.css';

function PostButton({ post }) {
  const navigate = useNavigate();
  return (
    <Card className="post-list-cards" sx={{ minWidth: 275 }} key={post.id}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {post.subtitle}
        </Typography>
        <Typography variant="h5" component="div">
          {post.title}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          author :
          {' '}
          {post.user_id}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          fellowers :
          {' '}
          {post.fellowers.length}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          likes :
          {' '}
          {post.likes.length}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          views :
          {' '}
          {post.view}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
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
      <CardActions>
        <Button size="small" onClick={() => navigate(`/post/${post.id}`)}>Learn More</Button>
      </CardActions>
    </Card>
  );
}

export default PostButton;
