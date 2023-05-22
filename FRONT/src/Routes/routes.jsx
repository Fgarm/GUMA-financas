import React from "react";
import LogUp from "../pages/LogUp";
import LogIn from "../pages/LogIn";
import Home from "../pages/Home";
import MyPage from "../pages/Groups";
import EntrarComLink from "../pages/Teste";
import GroupPage from "../pages/Grupo";
import ChartComponent from "../components/chart";
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
        path: "/statistics",
        element: 
        <React.StrictMode>
            <ChartComponent/>,
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

    {
        path: "join",
        element: <EntrarComLink />
    },

]);

export default Routering;
