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
} from 'chart.js';
import { Line } from 'react-chartjs-2';

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
);


// Dados do gráfico de Linha
const lineChartData = {
  labels: [],
  datasets: [
    {
      id: 1,
      fill: true,
      label: 'Total de Gastos',
      data: [],
      borderColor: 'rgb(220, 90, 50)',
      backgroundColor: 'rgb(230, 50, 45, 0.3)',
    },
  ],
};
// Configurações do gráfico de Linha
export const lineChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Total de Gastos dos Meses Anteriores',
      font: {
        size: 18,
      }
    },
  },
};


// Hook que carrega os dados do gráfico de Linha por meio da API do Back
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
  
  lineChartData.datasets[0].data = chartData["data"];
  lineChartData.labels = chartData["labels"];
  
  // para debug
  // console.log("dados q importam: ", data.datasets[0].data)
  // console.log("dados q importam: ", data.labels)
  
  return (
    <div className="LineChartComponent">
      <Line datasetIdKey='id' options={lineChartOptions} data={lineChartData} />
    </div>
  );

}

