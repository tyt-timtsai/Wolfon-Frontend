import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  IconButton, TextField, Tabs, Tab,
} from '@mui/material';
import SmartDisplayIcon from '@mui/icons-material/SmartDisplay';
import GroupsIcon from '@mui/icons-material/Groups';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ArticleIcon from '@mui/icons-material/Article';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import Header from '../components/header/header';
import SearchUserItem from '../components/search/userItem';
import Footer from '../components/footer/footer';
import constants from '../global/constants';
import './search.css';

function Search() {
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [type, setType] = useState('post');
  const [results, setResults] = useState();
  const [value, setValue] = useState(0);
  const [userData, setUserData] = useState(null);
  const types = ['post', 'live', 'user', 'community'];

  const handleChange = (e, index) => {
    setValue(index);
    setType(types[index]);
  };

  const handleInput = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e) => {
    setSearch(input);
    e.preventDefault();
  };

  useEffect(() => {
    axios.get(constants.PROFILE_API, {
      headers: {
        authorization: window.localStorage.getItem('JWT'),
      },
    }).then((res) => {
      console.log(res.data.data);
      setUserData(res.data.data);
    }).catch((err) => {
      console.log(err);
    });
  }, []);

  useEffect(() => {
    console.log(type);
    console.log(search);
    if (search) {
      axios.get(`${constants.SERVER_URL}/api/v1/${type}/search?keyword=${search}`)
        .then((res) => {
          console.log(res.data.data);
          setResults(res.data.data);
        }).catch((err) => {
          console.log(err);
        });
    }
  }, [type, search]);

  return (
    <>
      <Header />
      <div id="search-container">
        <div id="search-bar-container">
          <form action="" id="search-form" onSubmit={handleSubmit}>
            <TextField label="Search" variant="outlined" size="normal" id="search-input" sx={{ width: '100%', color: '#000' }} style={{ color: 'black' }} onChange={handleInput} value={input} />
            <IconButton onClick={handleSubmit}>
              <SearchRoundedIcon id="search-icon" />
            </IconButton>
          </form>
          <Tabs value={value} onChange={handleChange} id="search-tabs" aria-label="icon label tabs example">
            <Tab icon={<ArticleIcon />} label="post" />
            <Tab icon={<SmartDisplayIcon />} label="live" />
            <Tab icon={<AccountBoxIcon />} label="user" />
            <Tab icon={<GroupsIcon />} label="community" />
          </Tabs>
        </div>
        <div id="search-result-container">
          {results && type === 'post' ? results.map((result) => (
            <div key={result.id}>
              <p>post</p>
              <p>{result.id}</p>
              <p>{result.title}</p>
            </div>
          ))
            : (null)}
          {results && type === 'user' ? results.map((user) => (
            <SearchUserItem
              key={user.id}
              user={user}
              userData={userData}
            />
          ))
            : (null)}
          {results && type === 'live' ? results.map((result) => (
          // eslint-disable-next-line no-underscore-dangle
            <div key={result._id}>
              <p>
                Lives :
                {' '}
                {result.title || 'no title'}
              </p>
            </div>
          ))
            : (null)}
          {results && type === 'community' ? results.map((result) => (
            <div key={result.id}>
              <p>{result.id}</p>
              <p>
                community :
                {' '}
                {result.name}
              </p>
            </div>
          ))
            : (null)}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Search;
