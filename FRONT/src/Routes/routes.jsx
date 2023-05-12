import React from "react";
import LogUp from "../pages/LogUp";
import LogIn from "../pages/LogIn";
import Home from "../pages/Home";
import LineChartComponent from "../pages/Chart";

import { Navigate, createBrowserRouter } from "react-router-dom";
import DoughnutChartComponent from "../pages/Chart";

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
            <LineChartComponent/>,
            <DoughnutChartComponent/>, 
        </React.StrictMode>
    },


]);

export default Routering;
