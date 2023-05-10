import React from 'react';
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
import faker from 'faker';

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

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

export const data = {
  labels,
  datasets: [
    {
      id: 1,
      fill: true,
      label: 'Dataset 1',
      data: labels.map(() => faker.datatype.number({ min: -500, max: 1000 })),
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


// export const data2 = data.datasets.find((dataset) => dataset.id == 2);


export default function ChartComponent() {
  return (
    <div className="container">
      
      <div className="LineChartComponent">
        <Line datasetIdKey='id' options={options1} data={data} />
      </div>
      
      <div className="DonutChartComponent">
        <Doughnut options={options2} data={data2} />
      </div>
    
    </div>
  );
}
