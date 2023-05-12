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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  ArcElement // p grafico de rosquinha
);

export const options1 = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Total de Gastos dos Meses Anteriores',
      font: {
        size: 20
      }
    },
  },
};

export const options2 = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Gastos mais Relevantes do Mês',
      font: {
        size: 20
      },
    },
  },
};


const data = {
  labels: [],
  datasets: [
    {
      id: 1,
      fill: true,
      label: 'Total de Gastos',
      data: [],
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgb(53, 162, 235, 0.3)',
    },
  ],
};

export const data2 = {
  labels: ['Mercado', 'Aluguel', 'Energia', 'Água', 'Internet', 'Transporte'],
  datasets: [
    {
      label: 'R$',
      data: [350, 220, 40, 35, 50, 100],
      backgroundColor: [
        'rgba(54, 162, 235, 0.2)',  // Blue
        'rgba(75, 192, 192, 0.2)',  // Green
        'rgba(255, 206, 86, 0.2)',  // Yellow
        'rgba(255, 159, 64, 0.2)', // Orange
        'rgba(255, 99, 132, 0.2)',  // Red
        'rgba(153, 102, 255, 0.2)', // Purple
      ],
      borderColor: [
        'rgba(54, 162, 235, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(153, 102, 255, 1)',
      ],
      borderWidth: 1.1,
    },
  ],
};



export function useLineChartData() {
  const [chartData, setChartData] = useState(null);
  
  useEffect(() => {
    const user = localStorage.getItem("cadastro_user");
    const request = { user };
    
    axios.post('http://localhost:8000/api/gastos/total-gastos-meses-anteriores/', request)
    .then(response => {
        console.log("response: ", response.data)
        setChartData(response.data);
      })
      .catch(error => {
        console.log("Erro ao enviar/receber dados.", error);
        setChartData(null);
      });
  }, []);

  return chartData;
}


export default function LineChartComponent() {

  const chartData = useLineChartData();

  if(!chartData) {
    return <h1>Carregando Gráficos...</h1>;
  }

  data.datasets[0].data = chartData["data"];
  data.labels = chartData["labels"];
  
  // para debug
  // console.log("dados q importam: ", data.datasets[0].data)
  // console.log("dados q importam: ", data.labels)

  return (
    <div className="LineChartComponent">
      <Line datasetIdKey='id' options={options1} data={data} />
    </div>
  );

}
