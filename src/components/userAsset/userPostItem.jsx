import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card, CardContent, Typography,
} from '@mui/material';
import './userPostItem.css';

function UserPostItem({ post }) {
  const navigate = useNavigate();

  const cardStyle = {
    minWidth: '100%',
    backgroundColor: 'var(--secondary-bg-color)',
    color: 'var(--main-content-color)',
  };

  const subtitleStyle = {
    color: 'var(--main-content-color)',
    fontSize: 14,
  };

  const typographyStyle = {
    color: 'var(--main-content-color)',
    // mb: 1.5,
  };

  return (
    // eslint-disable-next-line no-underscore-dangle
    <Card className="post-list-cards" sx={cardStyle} key={post._id} onClick={() => navigate(`/post/${post._id}`)}>
      <CardContent>
        <div className="user-post-item-update">
          <Typography variant="body2">
            Created :
            {' '}
            {post.created_dt.slice(0, -4)}
          </Typography>
        </div>

        <div className="user-post-item-title">
          <Typography variant="h4" component="div">
            {post.title}
          </Typography>
          <Typography sx={subtitleStyle} gutterBottom>
            {post.subtitle}
          </Typography>
        </div>

        <div className="user-post-item-data">
          <div sx={typographyStyle} className="user-post-item-info">
            <p className="user-post-item-number">{post.view}</p>
            <p className="user-post-item-text">Views</p>
          </div>
          <div sx={typographyStyle} className="user-post-item-info">
            <p className="user-post-item-number">{post.followers.length}</p>
            <p className="user-post-item-text">Followers</p>
          </div>
          <div sx={typographyStyle} className="user-post-item-info">
            <p className="user-post-item-number">{post.likes.length}</p>
            <p className="user-post-item-text">Likes</p>
          </div>
          <div sx={typographyStyle} className="user-post-item-info">
            <p className="user-post-item-number">{post.comments.length}</p>
            <p className="user-post-item-text">Comments</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}

export default UserPostItem;
