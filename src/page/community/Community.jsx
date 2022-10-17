import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';
import constants from '../../global/constants';

function Community() {
  const location = useLocation();
  const [data, setData] = useState({});
  useEffect(() => {
    axios.get(`${constants.SERVER_URL}/api/v1${location.pathname}`)
      .then((res) => {
        setData(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <div>
      <Header />
      <h1>Community</h1>
      <div>
        <p>{data.name}</p>
        <p>{data.created_dt}</p>
        <p>
          {data.posts.length > 0 ? data.posts.map((post) => (
            <button type="button" key={post}>post</button>
          )) : 'No post'}
        </p>
        <p>
          {data.users.map((user) => (
            <p key={user}>{user}</p>
          ))}

        </p>
      </div>
      <Footer />
    </div>
  );
}

export default Community;
