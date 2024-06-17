import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = ({ setLoggedIn }) => {
  const navigate = useNavigate();

  useEffect(() => {
    setLoggedIn(false);
    navigate('/');
  }, [navigate, setLoggedIn]);

  return null;
};

export default Logout;
