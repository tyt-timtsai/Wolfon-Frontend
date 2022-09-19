import React, { useState, useEffect } from 'react';
import {
  // Paper,
  // ListItemIcon,
  Button,
  Avatar,
} from '@mui/material';
import './userItem.css';

function SearchUserItem({ user, userData }) {
  const [isMe, setIsMe] = useState(false);
  const [isApply, setIsApply] = useState(false);

  useEffect(() => {
    console.log(userData.apply_friends.includes(user.id));
    if (userData.apply_friends.includes(user.id)) {
      setIsApply(true);
    }
    if (userData.id === user.id) {
      setIsMe(true);
    }
  }, []);

  return (
    <div className="search-user-item">
      <div className="search-user-header">
        <Avatar alt={user.name} src="#" sx={{ width: 56, height: 56 }} />
        <p className="search-user-name">{user.name}</p>
      </div>
      <div className="search-user-infos">
        <div className="search-user-info border-right">
          <p className="search-user-number">{user.posts.length}</p>
          <p className="search-user-text">posts</p>
        </div>
        <div className="search-user-info">
          <p className="search-user-number">{user.fellowers.length}</p>
          <p className="search-user-text">fellowers</p>
        </div>
      </div>
      {isMe ? (<Button className="search-user-btn" variant="contained" type="button">個人頁面</Button>)
        : (
          <div>
            {isApply ? (
              <Button className="search-user-btn" variant="contained" color="error" type="button">取消申請</Button>
            ) : (
              <Button className="search-user-btn" variant="contained" type="button">申請好友</Button>
            )}
          </div>
        )}

    </div>
  );
}

export default SearchUserItem;
