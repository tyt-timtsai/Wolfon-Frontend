import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import constants from '../../global/constants';

function UserProfile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});

  const logout = () => {
    window.localStorage.removeItem('JWT');
    navigate('/');
  };

  useEffect(() => {
    axios.get(`${constants.SERVER_URL}/api/v1/user`, {
      headers: {
        authorization: `Bearer ${window.localStorage.getItem('JWT')}`,
      },
    }).then((res) => {
      //   const { data } = res.data;
      //   setUserData({
      //     id: data.id,
      //     name: data.name,
      //     email: data.email,
      //     created: data.created_dt,
      //     friends: data.friends,
      //     fellows: data.fellows,
      //     fellowers: data.fellowers,
      //     community: data.community,
      //     posts: data.posts,
      //     likePosts: data.like_posts,
      //     fellowPosts: data.fellow_posts,
      //     applyFriends: data.apply_friends,
      //   });

      setUserData(res.data.data);
    }).catch((err) => {
      console.log('Fetch profile error : ', err);
    });
  }, []);

  return (
    <div>
      <h1>
        Profile page |
        {' '}
        {userData.name}
      </h1>
      <button type="button" onClick={logout}>Logout</button>
      <h2>{userData.name}</h2>
      <p>{userData.email}</p>
      <p>{userData.posts}</p>
      <p>{userData.community}</p>
      <p>{userData.friends}</p>
      <p>{userData.photo}</p>
      <ul>
        {userData.pending_friends ? (
          <li key={userData.pending_friends}>
            pending_friends :
            {' '}
            {userData.pending_friends}
            <button type="button">Confirm</button>
            <button type="button">Reject</button>
          </li>
        ) : null}
      </ul>
      <ul>
        {userData.apply_friends ? (
          <li key={userData.apply_friends}>
            apply_friends :
            {' '}
            {userData.apply_friends}
            <button type="button">Cancel</button>
          </li>
        ) : null}
      </ul>
    </div>
  );
}

export default UserProfile;
