import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const Home = () => {
  const history = useHistory();

  useEffect(() => {
    const userInfo = localStorage.getItem('user-info');
    if (!userInfo) {
      // Chuyển hướng đến trang đăng nhập nếu không có thông tin user
      history.push('/login');
    }
    // Nếu có thông tin user, người dùng vẫn ở lại trang này
  }, [history]);

  return (
    <div>
      {/* Nội dung của trang Home */}
    </div>
  );
};

export default Home;
