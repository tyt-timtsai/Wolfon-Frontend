import React from 'react';
import {
  Card, CardContent, Button, Avatar,
} from '@mui/material';
import './userFriendItem.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import constants from '../../global/constants';

function UserFriendItem({
  friend, isFriend, assets, setAssets,
}) {
  const navigate = useNavigate();
  const cardStyle = {
    minWidth: '100%',
    backgroundColor: 'var(--secondary-bg-color)',
    color: 'var(--main-content-color)',
  };

  const acceptFriend = () => {
    console.log('axios accept');
    axios.patch(constants.ACCEPT_APPLY_API, { id: friend.id }, {
      headers: {
        authorization: window.localStorage.getItem('JWT'),
      },
    }).then((res) => {
      window.localStorage.setItem('JWT', res.data.data);
      const pendingFriends = assets.pendingFriends.filter((item) => item.id !== friend.id);
      setAssets({ pendingFriends, friends: [...assets.friends, friend] });
    }).catch((err) => {
      console.log(err);
    });
  };
  const rejectFriend = () => {
    axios.patch(constants.CANCEL_APPLY_API, { id: friend.id, action: 'reject' }, {
      headers: {
        authorization: window.localStorage.getItem('JWT'),
      },
    }).then((res) => {
      window.localStorage.setItem('JWT', res.data.data);
      const pendingFriends = assets.pendingFriends.filter((item) => item.id !== friend.id);
      setAssets({ pendingFriends, friends: [...assets.friends] });
    }).catch((err) => {
      console.log(err);
    });
  };
  const toProfile = () => {
    console.log('to profile');
    navigate(`/user/${friend.id}`);
  };

  return (
    // eslint-disable-next-line no-underscore-dangle
    <Card className="user-friend-item-container" sx={cardStyle} key={friend.id}>
      <CardContent>
        <div className="user-friend-item-header">
          <Avatar alt={friend.name} src={`${constants.IMAGE_URL}/${friend.photo}`} sx={{ width: 56, height: 56 }} />
          <p>{friend.name}</p>
        </div>

        <div className="user-friend-item-btns">
          <Button variant="outlined" onClick={toProfile}>個人頁面</Button>
          {isFriend ? null : (
            <>
              <Button variant="outlined" onClick={acceptFriend}>接受</Button>
              <Button variant="outlined" color="error" onClick={rejectFriend}>拒絕</Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default UserFriendItem;
