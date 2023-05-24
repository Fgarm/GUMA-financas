import React from 'react';
import { useState, useEffect } from 'react';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  ArcElement, // p grafico de rosquinha
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

import './style.css';
import axios from 'axios';
