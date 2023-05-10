import React from "react";
import LogUp from "../pages/LogUp";
import LogIn from "../pages/LogIn";
import Home from "../pages/Home";
import ChartComponent from "../pages/Chart";

import { Navigate, createBrowserRouter } from "react-router-dom";

function PrivateRoute({ children }) {
    const token = localStorage.getItem("token");
    if (token) {
        return children
    } else {
        return <Navigate to='/' replace/>
    }
  }

const Routering = createBrowserRouter([

    {
        path: "/",
        element: <LogIn/>,
    },
    
    {
        path: "/logup",
        element: <LogUp/>,
    },
    
    {
        path: "/home",
        element: 
        <PrivateRoute>
            <Home />
        </PrivateRoute>
    },
    
    {
        path: "/statistics",
        element: 
        <React.StrictMode>
            <ChartComponent/>,
        </React.StrictMode>
    },


]);

export default Routering;
