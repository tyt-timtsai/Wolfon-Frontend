import React from 'react';
import { useNavigate } from 'react-router-dom';

function PostButton({ post }) {
  const navigate = useNavigate();
  return (
    <button type="button" key={post.id} onClick={() => navigate(`/post/${post.id}`)}>
      <p>{post.title}</p>
      <p>{post.subtitle}</p>
      <p>
        author :
        {' '}
        {post.user_id}
      </p>
      <p>
        fellowers :
        {' '}
        {post.fellowers.length}
      </p>
      <p>
        likes :
        {' '}
        {post.likes.length}
      </p>
      <p>
        views :
        {' '}
        {post.view}
      </p>
      <p>
        last update :
        {' '}
        {post.updated_dt.slice(0, -4)}
      </p>
      <p>
        comments :
        {' '}
        {post.comments.length > 0 ? post.comments : 'No comment'}
      </p>
    </button>
  );
}

export default PostButton;
