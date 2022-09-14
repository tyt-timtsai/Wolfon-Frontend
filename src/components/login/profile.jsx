import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@mui/material';
import constants from '../../global/constants';

import './profile.css';

function UserProfile() {
  const [userData, setUserData] = useState({});

  const cancelApply = () => {
    console.log('cancel');
  };

  useEffect(() => {
    axios.get(`${constants.SERVER_URL}/api/v1/user`, {
      headers: {
        authorization: `Bearer ${window.localStorage.getItem('JWT')}`,
      },
    }).then((res) => {
      setUserData(res.data.data);
    }).catch((err) => {
      console.log('Fetch profile error : ', err);
    });
  }, []);

  return (
    <div id="profile-container">
      <h1>
        Profile page
      </h1>
      <h2>
        name :
        {' '}
        {userData.name}
      </h2>
      <p>
        email :
        {' '}
        {userData.email}
      </p>
      <p>
        psots :
        {' '}
        {userData.posts}
      </p>
      <p>
        community :
        {' '}
        {userData.community}
      </p>
      <p>
        friends :
        {' '}
        {userData.friends}
      </p>
      <p>
        photo :
        {' '}
        {userData.photo}
      </p>
      <ul>
        {userData.pending_friends > 0 ? (
          <li key={userData.pending_friends}>
            pending_friends :
            {' '}
            {userData.pending_friends}
            <Button type="button">Confirm</Button>
            <Button type="button">Reject</Button>
          </li>
        ) : null}
      </ul>
      <ul>
        {userData.apply_friends ? (
          <li key={userData.apply_friends}>
            apply_friends :
            {' '}
            {userData.apply_friends}
            <Button type="button" onClick={cancelApply}>Cancel</Button>
          </li>
        ) : null}
      </ul>
    </div>
  );
}

export default UserProfile;
