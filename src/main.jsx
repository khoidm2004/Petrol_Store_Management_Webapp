// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import './index.css'
// import LoginForm from './App.jsx'

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <LoginForm />
//   </React.StrictMode>,
// )

import React from "react";
import ReactDOM from 'react-dom/client'
import "bootstrap/dist/css/bootstrap.min.css";
import { Include } from './Page/Components/HomePage/Include.jsx';
// Importing the Bootstrap CSS
// const rootElement = document.getElementById("root");
// ReactDOM.render(<Include  />, rootElement);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Include />
  </React.StrictMode>,
)