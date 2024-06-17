import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginForm from "./Components/LoginForm/LoginForm";
import Include from "./Include";

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState('');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginForm setLoggedIn={setLoggedIn} />} />
        <Route path="/home/*" element={<Include setLoggedIn={setLoggedIn} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
