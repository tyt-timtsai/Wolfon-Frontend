import React, { useState, useEffect } from 'react';
import {
  Checkbox,
  Button,
  Avatar,
} from '@mui/material';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import constants from '../../global/constants';
import './userItem.css';

function SearchUserItem({ user, userData }) {
  const [isMe, setIsMe] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const [isApply, setIsApply] = useState(false);
  const [follow, setFollow] = useState(false);
  const navigate = useNavigate();
  const token = window.localStorage.getItem('JWT');

  const style = {
    position: 'relative',
    bottom: '90%',
    left: '37%',
    height: 0,
  };

  function followUser() {
    axios.post(
      constants.FOLLOW_USER_API,
      { id: user.id },
      { headers: { authorization: token } },
    ).then((res) => {
      console.log(res);
      window.localStorage.setItem('JWT', res.data.data);
    }).catch((err) => {
      console.log(err);
    });
  }

  function unFollowUser() {
    axios.delete(constants.FOLLOW_USER_API, {
      headers: { authorization: token },
      data: { id: user.id },
    }).then((res) => {
      console.log(res);
      window.localStorage.setItem('JWT', res.data.data);
    }).catch((err) => {
      console.log(err);
    });
  }

  const handleFollow = () => {
    setFollow(!follow);
    if (!follow) {
      followUser();
    } else {
      unFollowUser();
    }
  };

  const applyFriend = () => {
    axios.post(constants.APPLY_FRIEND_API, { id: user.id }, {
      headers: { authorization: token },
    })
      .then((res) => {
        console.log(res);
        window.localStorage.setItem('JWT', res.data.data);
        setIsApply(!isApply);
      }).catch((err) => {
        console.log(err);
      });
  };

  const cancelApply = () => {
    axios.put(constants.CANCEL_APPLY_API, { id: user.id, action: 'cancel' }, {
      headers: { authorization: token },
    })
      .then((res) => {
        console.log(res);
        window.localStorage.setItem('JWT', res.data.data);
        setIsApply(!isApply);
      }).catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (token) {
      if (userData.id === user.id) {
        setIsMe(true);
      }
      if (userData.friends.includes(user.id)) {
        setIsFriend(true);
      }
      if (userData.apply_friends.includes(user.id)) {
        setIsApply(true);
      }
      if (userData.follows.includes(user.id)) {
        setFollow(true);
      }
    }
  }, [isApply]);

  // For test
  useEffect(() => {
    console.log(isMe);
  }, [isMe]);

  return (
    <div className="search-user-item">
      {user.posts && user.followers && (
        <>
          <div className="search-user-header">
            <Avatar alt={user.name} src={`${constants.IMAGE_URL}/${user.photo}`} sx={{ width: 56, height: 56 }} />
            <p className="search-user-name">{user.name}</p>
          </div>
          <div className="search-user-infos">
            <div className="search-user-info border-right">
              <p className="search-user-number">{user.posts.length}</p>
              <p className="search-user-text">posts</p>
            </div>
            <div className="search-user-info">
              <p className="search-user-number">{user.followers.length}</p>
              <p className="search-user-text">followers</p>
            </div>
          </div>
          <div id="search-user-btns">
            <Button
              className="search-user-btn"
              variant="outlined"
              type="button"
              onClick={() => navigate(`/user/${user.id}`)}
            >
              個人頁面
            </Button>
            {userData != null
        && !isFriend && !isMe ? (
          <div>
            { isApply ? (
              <Button
                className="search-user-btn"
                variant="contained"
                color="error"
                type="button"
                onClick={cancelApply}
              >
                取消申請
              </Button>
            ) : (
              <Button
                className="search-user-btn"
                variant="contained"
                type="button"
                onClick={applyFriend}
              >
                申請好友
              </Button>
            )}
          </div>
              ) : null}
          </div>
          {token
      && (
      <Checkbox
        icon={<BookmarkBorderIcon sx={{ color: '#fff' }} />}
        checked={follow}
        checkedIcon={<BookmarkIcon />}
        onChange={handleFollow}
        className="search-user-follow-icon"
        style={style}
        size="large"
      />
      )}
        </>
      )}
    </div>
  );
}

export default SearchUserItem;
