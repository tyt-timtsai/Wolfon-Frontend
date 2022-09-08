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
import './signup.css';

function SignUp() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
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

  const signUp = () => {
    const dataArray = Object.values(userData);
    if (dataArray.some((value) => value === '')) {
      return console.log((Object.keys(userData)[dataArray.indexOf('')]), 'is miss.');
    }
    if (userData.password !== userData.confirm) {
      return console.log('confirm password wrong');
    }
    return (
      axios.post(`${constants.SERVER_URL}/api/v1/user/signup`, { data: userData })
        .then((res) => {
          console.log(res);
          window.localStorage.setItem('JWT', res.data.data);
          navigate('/user/profile');
        })
        .catch((err) => console.log(err))
    );
  };

  return (
    <div id="signup-container">
      <Paper elevation={6} id="signup-paper">
        <div id="signup-header">
          <img id="sign-logo" src="/wolf-emblem.png" alt="logo" />
          <p>Wolfon</p>
        </div>
        <div id="signup-input-container">
          <TextField
            required
            id="signup-name"
            className="signup-inputs"
            label="Name"
            value={userData.name}
            onChange={handleChange('name')}
            variant="filled"
            margin="dense"
          />
          <TextField
            required
            id="signup-email"
            className="signup-inputs"
            label="Email"
            value={userData.email}
            onChange={handleChange('email')}
            variant="filled"
            margin="dense"
          />
          <FormControl required variant="filled" margin="dense">
            <InputLabel htmlFor="signup-password">Password</InputLabel>
            <FilledInput
              id="signup-password"
              className="signup-inputs"
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
            id="signup-confirm"
            className="signup-inputs"
            label="Confirm Password"
            value={userData.confirm}
            onChange={handleChange('confirm')}
            variant="filled"
            margin="dense"
          />
        </div>
        <Button id="signup-btn" onClick={signUp}>Sign up</Button>
      </Paper>
    </div>
  );
}

export default SignUp;
