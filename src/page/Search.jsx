import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/header/header';
import Footer from '../components/footer/footer';
import constants from '../global/constants';

function Search() {
  const [input, setInput] = useState('');
  const [type, setType] = useState('post');
  const [results, setResults] = useState();

  const handleInput = (e) => {
    setInput(e.target.value);
  };

  const handleType = (e) => {
    setType(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.get(`${constants.SERVER_URL}/api/v1/${type}/search?keyword=${input}`)
      .then((res) => {
        setResults(res.data.data);
      }).catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    setResults(null);
    setInput('');
  }, [type]);

  return (
    <div>
      <Header />
      <h1>Search</h1>
      <form action="" onSubmit={handleSubmit}>
        <select name="type" id="search-type" value={type} onChange={handleType}>
          <option value="post">Post</option>
          <option value="user">User</option>
          <option value="community">Community</option>
        </select>
        <input type="text" id="input" onChange={handleInput} value={input} />
        <button type="submit" onSubmit={handleSubmit}>Submit</button>
      </form>
      {results && type === 'post' ? results.map((result) => (
        <div key={result.id}>
          <p>post</p>
          <p>{result.id}</p>
        </div>
      ))
        : (null)}
      {results && type === 'user' ? results.map((result) => (
        <div key={result.id}>
          <p>user</p>
          <p>{result.id}</p>
        </div>
      ))
        : (null)}
      {results && type === 'community' ? results.map((result) => (
        <div key={result.id}>
          <p>community</p>
          <p>{result.id}</p>
        </div>
      ))
        : (null)}
      <Footer />
    </div>
  );
}

export default Search;
