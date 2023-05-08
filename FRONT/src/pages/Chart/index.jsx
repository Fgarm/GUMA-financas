import React, { useState, useEffect, useRef } from "react";
import './style.css';

import { UserData } from "./Data";
import { Bar } from "react-chartjs-2";

import { Input, InputGroup, InputRightElement, Button, Link } from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';



export default function ChartComponent() {

  const [userData, setUserData] = useState({
    labels: UserData.map((data) => data.year),
    datasets: [
      {
        label: "Users Gained",
        data: UserData.map((data) => data.userGain),
        backgroundColor: [
          "rgba(75,192,192,1)",
          "#ecf0f1",
          "#50AF95",
          "#f6f3b3",
          "#2a71d0",
        ],
        borderColor: "black",
        borderWidth: 2,
      },
    ],
  });

  useEffect(() => {
    setUserData({
      labels: UserData.map((data) => data.year),
      datasets: [
        {
          label: "Users Gained",
          data: UserData.map((data) => data.userGain),
          backgroundColor: [
            "rgba(75,192,192,1)",
            "#ecf0f1",
            "#50AF95",
            "#f6f3b3",
            "#2a71d0",
          ],
          borderColor: "black",
          borderWidth: 2,
        },
      ],
    });
  }, []);

  return (
    <div className="ChartComponent">
      <div style={{ width: 700 }}>
        {userData.labels && userData.datasets ? (
          <Bar chartData={userData} />
        ) : (
          <p>Loading chart data...</p>
        )}
      </div>
    </div>
  );
}
