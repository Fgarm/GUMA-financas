import React from 'react';
import { useState, useEffect } from 'react';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

import './style.css';
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


// Configurações do gráfico de Barras
export const barOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Média Mensal de Gastos por Categoria em um Período',
        },
    },
};


// Dados do gráfico de Barras
export const barChartData = {
    labels: [],                                          // Período (string)
    datasets: [
        // {
        //   label: 'Dataset 1',                         // categoria
        //   data:                                       // média
        //   backgroundColor: 'rgba(255, 99, 132, 0.5)', // cor
        // },
    ],
};



// componente gráfico de Barras para exibir a média mensal de gastos por categoria durante um período específico
export default function BarChartComponent() {

    const [chartData, setChartData] = useState(null);
    const [period, setPeriod] = useState(3);
    
    const handleSelectPeriodChange = (event) => {
        setPeriod(event.target.value);
    };
    
    // carrega os dados do gráfico de Barras por meio da API do Back
    useEffect(() => {

        const fetchBarChartData = async () => {

            const user = localStorage.getItem("cadastro_user");
            const periodo = period;

            const request = {
                user,
                periodo,
            };
            
            console.log("request: ", request)
            
            axios.post('http://localhost:8000/api/gastos/media-mensal-por-tag-em-periodo/', request)
                .then(response => {
                    const json_response = response.data
                    console.log("response: ", json_response)
                    setChartData(json_response);
                })
                .catch(error => {
                    console.log("Erro ao enviar/receber dados.", error);
                    setChartData(null);
                });
        };
        
        setChartData(null);
        fetchBarChartData();

    }, [period]);

    if (!chartData) {
        return <h1>Carregando Gráficos...</h1>;
    }
    
    // atribuindo o conteúdo da resposta do Back para barChartData
    const labels = [];
    labels[0] = chartData["labels"]

    barChartData.labels[0] = chartData["labels"]
    
    barChartData.datasets = chartData["datasets"]
    
    // console.log("DATASETS: ", barChartData.datasets)

    const options = [
        { value: 3, label: '3 meses' },
        { value: 6, label: '6 meses' },
        { value: 12, label: '12 meses' },
        { value: 24, label: '24 meses' },
        { value: 36, label: '36 meses' },
    ];
    
    return (
        <div className="DonutChartContainer">
            <Bar options={barOptions} data={barChartData} />
            
            <div className="month-year-input-container">

                <select className="month-input" value={period} onChange={handleSelectPeriodChange}>

                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}

                </select>

            </div>

        </div>
    );
}
