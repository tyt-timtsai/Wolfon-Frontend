/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Avatar,
  Box,
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import constants from '../../global/constants';
import Header from '../../components/header/header';
import UserLiveItem from '../../components/userAsset/userLiveItem';
import PostList from '../../components/post/Post_list';
import Footer from '../../components/footer/footer';

import './profile.css';

function Profile() {
  const params = useParams();
  const [user, setUser] = useState(null);
  const [category, setCategory] = useState('post');
  const [assets, setAssets] = useState(null);
  const [isFetching, setIsFetching] = useState(true);

  const handleCategory = (prop) => () => {
    if (prop !== category) {
      setAssets(null);
      setCategory(prop);
    }
  };

  useEffect(() => {
    axios.post(constants.USER_PAGE_API, { id: params.id }, {
      headers: {
        authorization: window.localStorage.getItem('JWT'),
      },
    }).then((res) => {
      console.log(res);
      setUser(res.data.data);
    }).catch((err) => {
      console.log(err);
    });
    console.log(params.id);
  }, [params]);

  useEffect(() => {
    let url;
    if (user) {
      setIsFetching(true);
      switch (category) {
        case 'post':
          url = constants.GET_USER_POST_API;
          break;
        case 'live':
          url = constants.GET_USER_LIVE_API;
          break;
        case 'follow':
          url = constants.GET_USER_FOLLOW_POST_API;
          break;
        case 'like':
          url = constants.GET_USER_LIKE_API;
          break;

        default:
          break;
      }
      axios.post(url, { id: user.id })
        .then((res) => {
          console.log(res.data.data);
          setAssets(res.data.data);
          setIsFetching(false);
        }).catch((err) => {
          console.log(err);
          setIsFetching(false);
        });
    }
  }, [user, category]);
  return (
    <>
      <Header />
      <div id="user-profile-container">
        { user
          ? (
            <>

              <div className="user-profile-header">
                <img
                  id="user-profile-background"
                  src={user.background_image
                    ? `${constants.IMAGE_URL}/${user.background_image}` : '/profile-background.jpg'}
                  alt="background"
                />
                <div id="user-profile-infos">
                  <button
                    type="button"
                    className="user-profile-info"
                    onClick={handleCategory('post')}
                    id={category === 'post' ? 'user-profile-info-active' : ''}
                  >
                    <p className="user-profile-info-number">
                      {user.posts.length}
                    </p>
                    <p className="user-profile-info-text">
                      Post
                    </p>
                  </button>

                  <button
                    type="button"
                    className="user-profile-info"
                    onClick={handleCategory('live')}
                    id={category === 'live' ? 'user-profile-info-active' : ''}
                  >
                    <p className="user-profile-info-number">
                      {user.lives.length}
                    </p>
                    <p className="user-profile-info-text">
                      Live
                    </p>
                  </button>

                  <div id="user-profile-avatar">
                    <Avatar
                      src={user.photo ? `${constants.IMAGE_URL}/${user.photo}` : null}
                      sx={{ width: 150, height: 150 }}
                    />
                    <p id="user-profile-name">{user.name}</p>
                  </div>

                  <button
                    type="button"
                    className="user-profile-info"
                    onClick={handleCategory('follow')}
                    id={category === 'follow' ? 'user-profile-info-active' : ''}
                  >
                    <p className="user-profile-info-number">
                      {user.follow_posts.length}
                    </p>
                    <p className="user-profile-info-text">
                      Followe Post
                    </p>
                  </button>

                  <button
                    type="button"
                    className="user-profile-info"
                    onClick={handleCategory('like')}
                    id={category === 'like' ? 'user-profile-info-active' : ''}
                  >
                    <p className="user-profile-info-number">
                      {user.like_posts.length}
                    </p>
                    <p className="user-profile-info-text">
                      Like Post
                    </p>
                  </button>

                </div>
              </div>

              <div className="user-profile-assets-container">
                {isFetching ? (
                  <Box sx={{ display: 'flex', marginLeft: '49%' }}>
                    <CircularProgress size={30} color="inherit" />
                  </Box>
                ) : (
                  <>
                    {category === 'post' && user != null ? (
                      <div className="live-list-item-container">
                        {assets ? assets.reverse().map((post) => (
                          <PostList
                            key={post._id}
                            post={post}
                          />
                        )) : null}
                      </div>
                    ) : null}

                    {category === 'live' && user != null ? (
                      <div className="live-list-item-container">
                        {assets ? assets.reverse().map((live) => (
                          <UserLiveItem
                            live={live}
                            key={live._id}
                          />
                        )) : null}
                      </div>
                    ) : null}

                    {category === 'follow' && user != null ? (
                      <div className="live-list-item-container">
                        {assets ? assets.reverse().map((post) => (
                          <PostList
                            key={post._id}
                            post={post}
                          />
                        )) : null}
                      </div>
                    ) : null}

                    {category === 'like' && user != null ? (
                      <div className="live-list-item-container">
                        {assets ? assets.reverse().map((post) => (
                          <PostList
                            key={post._id}
                            post={post}
                          />
                        )) : null}
                      </div>
                    ) : null}
                  </>
                )}
              </div>

            </>
          )
          : null}
      </div>
      <Footer />
    </>
  );
}

export default Profile;
