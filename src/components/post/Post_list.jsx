/* eslint-disable no-underscore-dangle */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card, CardContent, Avatar,
} from '@mui/material';
import { BsBookmarksFill } from 'react-icons/bs';
import Favorite from '@mui/icons-material/Favorite';
// import { FaCommentAlt } from 'react-icons/fa';
import './post_list.css';
import constants from '../../global/constants';

function PostButton({ post }) {
  const navigate = useNavigate();

  const cardStyle = {
    minWidth: 275,
    backgroundColor: 'var(--secondary-bg-color)',
    color: 'var(--main-content-color)',
  };

  return (
    // eslint-disable-next-line no-underscore-dangle
    <Card
      className="post-list-cards"
      sx={cardStyle}
      key={post._id}
      onClick={() => navigate(`/post/${post._id}`)}
    >
      {post.updated_dt && (
      <CardContent className="post-list-cards-container">

        <div className="post-list-card-author">
          <Avatar
            alt="author avatar"
            src={post.author_photo ? `${constants.IMAGE_URL}/${post.author_photo}` : null}
          />
          <div>
            <p className="post-list-author-name">
              {post.author}
            </p>
            <p className="post-list-author-update">
              {post.updated_dt.slice(0, -4)}
              {' '}
              published
            </p>
          </div>
        </div>

        <div className="post-list-card-title">
          <p className="post-list-title">{post.title}</p>
          <p className="post-list-subtitle">{post.subtitle}</p>
        </div>

        <div className="post-list-card-info">
          <div className="post-list-info-container">
            <div className="post-list-info">
              {post.likes.length}
              <Favorite sx={{ width: 18, height: 18, color: '#fff' }} />
            </div>

            <div className="post-list-info">
              {post.followers.length}
              <BsBookmarksFill style={{ width: 18, height: 18 }} />
            </div>
          </div>

          <div className="post-list-view">
            {post.view}
            {' '}
            views
          </div>
        </div>

      </CardContent>
      )}
    </Card>
  );
}

export default PostButton;
