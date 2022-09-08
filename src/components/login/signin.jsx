import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Paper,
  Button,
  TextField,
  FormControl,
  InputLabel,
  FilledInput,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import constants from '../../global/constants';
import './signin.css';

function signIn() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    email: 'sam22@gmail.com',
    password: 'sam22',
    confirm: 'sam22',
    showPassword: false,
  });

  const handleChange = (prop) => (e) => {
    setUserData({ ...userData, [prop]: e.target.value });
  };

  const handleClickShowPassword = () => {
    setUserData({
      ...userData,
      showPassword: !userData.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const signin = () => {
    console.log(userData);
    const dataArray = Object.values(userData);
    if (dataArray.some((value) => value === '')) {
      return console.log((Object.keys(userData)[dataArray.indexOf('')]), 'is miss.');
    }
    if (userData.password !== userData.confirm) {
      return console.log('confirm password wrong');
    }
    return (
      axios.post(`${constants.SERVER_URL}/api/v1/user/signin`, { data: userData })
        .then((res) => {
          console.log(res);
          setUserData({
            email: userData.email,
            password: '',
            confirm: '',
            showPassword: false,
          });
          window.localStorage.setItem('JWT', res.data.data);
          navigate('/user/profile');
        })
        .catch((err) => console.log(err))
    );
  };

  return (
    <div id="signin-container">
      <Paper elevation={6} id="signin-paper">
        <div id="signin-header">
          <img id="sign-logo" src="/wolf-emblem.png" alt="logo" />
          <p>Wolfon</p>
        </div>
        <div id="signin-input-container">
          <TextField
            required
            id="signin-email"
            className="signin-inputs"
            label="Email"
            value={userData.email}
            onChange={handleChange('email')}
            variant="filled"
            margin="dense"
          />
          <FormControl required variant="filled" margin="dense">
            <InputLabel htmlFor="signin-password">Password</InputLabel>
            <FilledInput
              id="signin-password"
              className="signin-inputs"
              type={userData.showPassword ? 'text' : 'password'}
              value={userData.password}
              onChange={handleChange('password')}
              endAdornment={(
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {userData.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
            )}
            />
          </FormControl>
          <TextField
            required
            type={userData.showPassword ? 'text' : 'password'}
            id="signin-confirm"
            className="signin-inputs"
            label="Confirm Password"
            value={userData.confirm}
            onChange={handleChange('confirm')}
            variant="filled"
            margin="dense"
          />
        </div>
        <Button id="signin-btn" onClick={signin}>Sign in</Button>
      </Paper>
    </div>
  );
}

export default signIn;
