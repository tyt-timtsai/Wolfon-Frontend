import React, { useEffect, useState } from 'react';
import axios from 'axios';
import constants from '../../global/constants';

function Profile() {
  const [userData, setUserData] = useState();
  useEffect(() => {
    const jwt = window.localStorage.getItem('jwt');
    if (!jwt) {
      window.location('/user/login');
    }
    axios.get(`${constants}/api/v1/`, { headers: { authorization: jwt } })
      .then((res) => {
        console.log(res);
        if (res.status !== 200) {
          console.log('JWT Verify failed');
          window.location('/user/login');
        } else {
          setUserData(res.data);
        }
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <div>
      <h1>Profile page</h1>
      <div>{userData}</div>

      <div>
        <p>name</p>
        <p>posts: </p>
        <p>new boardcast: </p>
      </div>
    </div>

  );
}

export default Profile;
