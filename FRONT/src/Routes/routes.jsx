import React from "react";
import LogUp from "../pages/LogUp";
import LogIn from "../pages/LogIn";
import Home from "../pages/Home";

import { createBrowserRouter } from "react-router-dom";

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
        element: <Home/>,
    },
]);

export default Routering;
