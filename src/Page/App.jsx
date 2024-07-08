import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginForm from "./Components/LoginForm/LoginForm";
import Include from "./Include";
import NotFoundPage from "./Components/NotFound/notFound.jsx";

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const userInfo = localStorage.getItem("user-info");
    if (userInfo) {
      setLoggedIn(true);
    }
  }, []);

  console.log()
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm setLoggedIn={setLoggedIn} />} />
        <Route path="/*" element={loggedIn ? <Include setLoggedIn={setLoggedIn} /> : <NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;
