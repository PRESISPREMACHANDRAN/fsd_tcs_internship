import { useState } from 'react';

const useToken = () => {
  const getToken = () => {
    const tokenString = localStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    return userToken;
  };

  const [token, setTokenState] = useState(getToken());

  const setToken = userToken => {
    localStorage.setItem('token', JSON.stringify(userToken));
    setTokenState(userToken);
  };

  return {
    token,
    setToken
  };
};

export default useToken;