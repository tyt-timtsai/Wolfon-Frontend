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
import Swal from 'sweetalert2';
import validator from 'validator';
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
    const {
      name, email, password, confirm,
    } = userData;
    if (name.toString().trim() === '') {
      return Swal.fire({
        title: 'Error!',
        text: '請填寫名字',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }

    if (email.toString().trim() === ''
    ) {
      return Swal.fire({
        title: 'Error!',
        text: '請填寫信箱',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }

    if (!validator.isEmail(email)) {
      return Swal.fire({
        title: 'Error!',
        text: '信箱格式錯誤',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }

    if (
      password.toString().trim() === ''
    || confirm.toString().trim() === ''
    ) {
      return Swal.fire({
        title: 'Error!',
        text: '請填寫密碼',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }

    if (userData.password !== userData.confirm) {
      return Swal.fire({
        title: 'Error!',
        text: '確認密碼錯誤',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
    return (
      axios.post(constants.SIGNUP_API, { data: userData })
        .then((res) => {
          console.log(res);
          window.localStorage.setItem('JWT', res.data.data);
          navigate('/user/profile');
        })
        .catch((err) => {
          if (err.response.status === 400 || err.response.status === 401) {
            Swal.fire({
              title: 'Error!',
              text: `${err.response.message}`,
              icon: 'error',
              confirmButtonText: 'OK',
            });
          }
        })
    );
  };

  return (
    <div id="signup-container">
      <Paper elevation={6} id="signup-paper">
        <div id="signup-header">
          <img id="sign-logo" src="/wolf-emblem.png" alt="logo" />
        </div>
        <div id="signup-input-container">
          <TextField
            id="signup-name"
            className="signup-inputs"
            label="Name"
            value={userData.name}
            onChange={handleChange('name')}
            variant="filled"
            margin="dense"
          />
          <TextField
            id="signup-email"
            className="signup-inputs"
            label="Email"
            value={userData.email}
            onChange={handleChange('email')}
            variant="filled"
            margin="dense"
          />
          <FormControl
            variant="filled"
            margin="dense"
          >
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
