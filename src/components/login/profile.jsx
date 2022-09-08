import React, { useEffect, useState } from 'react';
import axios from 'axios';
import constants from '../../global/constants';

function Profile({ socket }) {
  const [userData, setUserData] = useState({});

  useEffect(() => {
    axios.get(`${constants.SERVER_URL}/api/v1/user`, {
      headers: {
        authorization: `Bearer ${window.localStorage.getItem('JWT')}`,
      },
    }).then((res) => {
      console.log(res);
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
    return (() => socket.disconnect());
  }, []);
  useEffect(() => {
    console.log(userData);
  }, [userData]);

  return (
    <div>
      <h1>Profile page</h1>
      <p>{userData.name}</p>
    </div>
  );
}

export default Profile;
