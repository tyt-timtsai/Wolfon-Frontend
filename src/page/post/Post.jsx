import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Checkbox, Paper } from '@mui/material';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import parser from 'html-react-parser';
import Footer from '../../components/footer/footer';
import Header from '../../components/header/header';
import constants from '../../global/constants';
import './post.css';

function Post() {
  const location = useLocation();
  const [post, setPost] = useState('');
  const [author, serAuthor] = useState('');
  const [like, setLike] = useState(false);
  const [likes, setLikes] = useState();
  const [fellow, setFellow] = useState(false);
  const [fellowers, setFellowers] = useState();

  async function likePost() {
    axios.get(`${constants.SERVER_URL}/api/v1/post/like/${post.id}`, {
      headers: {
        authorization: window.localStorage.getItem('JWT'),
      },
    })
      .then((res) => {
        console.log(res);
        window.localStorage.setItem('JWT', res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function fellowPost() {
    axios.get(`${constants.SERVER_URL}/api/v1/post/fellow/${post.id}`, {
      headers: {
        authorization: window.localStorage.getItem('JWT'),
      },
    })
      .then((res) => {
        console.log(res);
        window.localStorage.setItem('JWT', res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const handleChange = (prop) => async () => {
    if (!window.localStorage.getItem('JWT')) {
      return alert('Please Login');
    }
    switch (prop) {
      case 'like':
        await likePost();
        setLike(!like);
        if (like) {
          setLikes(likes - 1);
        } else {
          setLikes(likes + 1);
        }
        break;

      case 'fellow':
        await fellowPost();
        setFellow(!fellow);
        if (fellow) {
          setFellowers(fellowers - 1);
        } else {
          setFellowers(fellowers + 1);
        }
        break;
      default:
        break;
    }

    return 0;
  };

  async function getPost() {
    const result = await axios.get(`${constants.SERVER_URL}/api/v1${location.pathname}`);
    console.log(result);
    const postData = result.data.data;
    setPost(postData.post);
    serAuthor(postData.user);
    setLikes(postData.post.likes.length);
    setFellowers(postData.post.fellowers.length);
    return postData;
  }

  async function getUser() {
    const result = await axios.get(`${constants.SERVER_URL}/api/v1/user`, {
      headers: {
        authorization: window.localStorage.getItem('JWT'),
      },
    });
    console.log(result);
    const userData = result.data.data;
    return userData;
  }

  async function initPost() {
    const postData = await getPost();
    const userData = await getUser();
    const userId = userData.id;
    setLike(postData.post.likes.includes(userId));
    setFellow(postData.post.fellowers.includes(userId));
  }

  useEffect(() => {
    initPost();
  }, []);

  useEffect(() => {
    console.log(like);
    console.log(fellow);
  }, [like, fellow]);

  return (
    <>
      <Header />
      {post ? (
        <div id="post-detail-container">
          <div id="post-details">
            <div className="post-detail-icons">
              <Checkbox
                icon={<FavoriteBorder />}
                checked={like}
                checkedIcon={<Favorite sx={{ color: '#F50057' }} />}
                onChange={handleChange('like')}
              />
              <p>{like}</p>
              <p>
                {likes}
              </p>
            </div>
            <div className="post-detail-icons">
              <Checkbox
                icon={<BookmarkBorderIcon />}
                checked={fellow}
                checkedIcon={<BookmarkIcon />}
                onChange={handleChange('fellow')}
              />
              <p>{fellow}</p>
              <p>
                {fellowers}
              </p>
            </div>
          </div>

          <Paper elevation={6} id="post-detail-content">
            <div id="post-detail-content-header">
              <h1>{post.title}</h1>
              <h3>{post.subtitle}</h3>
              <p>
                post on :
                {' '}
                {post.created_dt}
              </p>
              <p>
                update :
                {' '}
                {post.updated_dt}
              </p>
            </div>

            <div className="ProseMirror">
              {parser(post.content)}
            </div>

          </Paper>

          <Paper elevation={6} id="post-detail-author">
            <p>{author.name}</p>
            <p>{author.created_dt}</p>
          </Paper>
        </div>
      ) : <p> Not Found</p>}
      <Footer />
    </>
  );
}

export default Post;
