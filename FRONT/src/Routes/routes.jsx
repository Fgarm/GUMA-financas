import React from "react";
import LogUp from "../pages/LogUp";
import LogIn from "../pages/LogIn";
import Home from "../pages/Home";
import MyPage from "../pages/Groups";
import GroupPage from "../pages/Grupo";
import Graficos from "../pages/Graficos";
import EntrarComLink from "../components/joinGroup";
import Extratos from "../pages/Extratos"
import Saldo from "../pages/Saldos/Saldos";
import { Navigate, createBrowserRouter } from "react-router-dom";
import { elements } from "chart.js";

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
        path: "/join",
        element:
        <React.StrictMode>
            <EntrarComLink/>
        </React.StrictMode>
    },

    {
        path: "/page",
        element: <MyPage/>,
    },


    {
        path: "/saldos",
        element: <Saldo />,
    },

    {
        path: "group",
        element: <GroupPage/>,
    },

]);

export default Routering;
