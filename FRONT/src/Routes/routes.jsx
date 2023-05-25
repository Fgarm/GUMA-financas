import React from "react";
import LogUp from "../pages/LogUp";
import LogIn from "../pages/LogIn";
import Home from "../pages/Home";

import Graficos from "../pages/Graficos";

import MyPage from "../pages/Groups";
import GroupPage from "../pages/Grupo";
import Extratos from "../pages/Extratos/Extratos"
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
        path: "/dashboard",
        element: 
        <React.StrictMode>
            <Graficos />
        </React.StrictMode>
    },

    {
        path: "/page",
        element: <MyPage/>,
    },

    {
        path: "/extratos",
        element: <Extratos />,
    },

    {
        path: "group",
        element: <GroupPage/>,
    },

]);

export default Routering;
