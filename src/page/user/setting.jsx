import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/header/header';
import UserSetting from '../../components/login/setting';
import Footer from '../../components/footer/footer';

function Setting() {
  const navigate = useNavigate();
  useEffect(() => {
    const jwt = window.localStorage.getItem('JWT');
    if (!jwt) {
      navigate('/user/login');
    }
  }, []);
  return (
    <>
      <Header />
      <UserSetting />
      <Footer />
    </>

  );
}

export default Setting;
