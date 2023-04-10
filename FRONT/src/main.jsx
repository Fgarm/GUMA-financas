import React from 'react';
import ReactDOM from 'react-dom/client';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';

import LogUp from './pages/LogUp';
import LogIn from './pages/LogIn';
import Home from './pages/Home';


import 'bootstrap/dist/css/bootstrap.min.css';

const router = createBrowserRouter([
  { 
    path: '/',
    element: <LogUp/> 
  },

  {
    path: '/login',
    element: <LogIn/>
  },

  {
    path:'/home',
    element: <Home/>
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
