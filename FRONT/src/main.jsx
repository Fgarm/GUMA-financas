import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LogUp from './pages/LogUp'
import './index.css'
import LogIn from './pages/LogIn'

const router = createBrowserRouter([
  { 
    path: '/',
    element: <LogUp/> 
  },

  {
    path: '/login',
    element: <LogIn/>
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
