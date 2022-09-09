import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/header/header';
import UserProfile from '../../components/login/profile';
import Footer from '../../components/footer/footer';

function Profile() {
  const navigate = useNavigate();
  useEffect(() => {
    const jwt = window.localStorage.getItem('JWT');
    if (!jwt) {
      navigate('/user/login');
    }
  }, []);
  return (
    <div>
      <Header />
      <UserProfile />
      <Footer />
    </div>

  );
}

export default Profile;
