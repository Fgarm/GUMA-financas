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
import { Doughnut } from 'react-chartjs-2';

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
    
// Global
const dataAtual = new Date();
const anoAtual = dataAtual.getFullYear();

// converte formato de cor de hexadecimal para RGB
function hexToRgb(listHex) {
    
    const backgroundColorList = []
    const borderColorList = []

    listHex.forEach(hex => {

        // convertendo cada parte de uma string hexadecimal em inteiros
        var r = parseInt(hex.substring(0, 2), 16);
        var g = parseInt(hex.substring(2, 4), 16);
        var b = parseInt(hex.substring(4, 6), 16);

        // criando string RGB - 'rgba({R}, {G}, {B}, {opacity})'
        backgroundColorList.push(`rgba(${r}, ${g}, ${b}, 0.3)`);
        borderColorList.push(`rgba(${r}, ${g}, ${b}, 1)`);
    })

    // retornando objeto js com as duas listas
    return { backgroundColorList, borderColorList };
}

// Configurações do gráfico de Rosquinha
export const doughnutOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: 'right',
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

// Dados do gráfico de Rosquinha
export const doughnutChartData = {
    labels: [], // 'Mercado', 'Aluguel', 'Energia', 'Água', 'Internet', 'Transporte'
    datasets: [
        {
            label: 'R$',
            data: [], // 350, 220, 40, 35, 50, 100
            backgroundColor: [],
            /*
              'rgba(54, 162, 235, 0.2)',  // Blue
              'rgba(75, 192, 192, 0.2)',  // Green
              'rgba(255, 206, 86, 0.2)',  // Yellow
              'rgba(255, 159, 64, 0.2)', // Orange
              'rgba(255, 99, 132, 0.2)',  // Red
              'rgba(153, 102, 255, 0.2)', // Purple
            */

            borderColor: [],
            /*
              'rgba(54, 162, 235, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(255, 159, 64, 1)',
              'rgba(255, 99, 132, 1)',
              'rgba(153, 102, 255, 1)',
            */

            borderWidth: 1.1,
        },
    ],
};



// componente do gráfico doughnut para os gastos mais relevantes
export default function DoughnutChartComponent() {
    
    // chartData: { data, labels(tags), colors }
    const [chartData, setChartData] = useState(null);
    const [month, setMonth] = useState(dataAtual.getMonth()+1);
    const [year, setYear] = useState(dataAtual.getFullYear());
    
    const handleSelectMonthChange = (event) => {
        setMonth(event.target.value);
    };

    const handleSelectYearChange = (event) => {
        setYear(event.target.value);
    };
    
    // carrega os dados do gráfico de Rosquinha por meio da API do Back
    useEffect(() => {

        const fetchDoughnutChartData = async () => {

            const user = localStorage.getItem("cadastro_user"); // "token"
            const mes = month;
            const ano = year;

            const request = {
                user,
                mes,
                ano,
            };
            
            console.log("request: ", request)
            
            axios.post('http://localhost:8000/api/gastos/gastos-mais-relevantes/', request)
                .then(response => {
                    console.log("response: ", response.data)
                    setChartData(response.data);
                })
                .catch(error => {
                    console.log("Erro ao enviar/receber dados.", error);
                    setChartData(null);
                });
        };
        
        setChartData(null);
        fetchDoughnutChartData();

    }, [month, year]);

    if (!chartData) {
        return <h1>Carregando Gráficos...</h1>;
    }
    
    // data
    doughnutChartData.datasets[0].data = chartData["data"]

    // labels/tags
    doughnutChartData.labels = chartData["labels"]

    // colors
    const colorObject = hexToRgb(chartData["colors"])
    
    doughnutChartData.datasets[0].backgroundColor = colorObject.backgroundColorList
    doughnutChartData.datasets[0].borderColor = colorObject.borderColorList
    
    // para debug
    // console.log("data: ", doughnutChartData.datasets[0].data)
    // console.log("labels/tags: ", doughnutChartData.labels)
    // console.log("colors: ", doughnutChartData.datasets[0].backgroundColor)

    const meses = [
        'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
        'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
    ];
    
    const anos = [
        anoAtual, anoAtual-1, anoAtual-2, anoAtual-3
    ]
    
    return (
        <div className="DonutChartContainer">
            <Doughnut className="DonutChartComponent" options={doughnutOptions} data={doughnutChartData} />
            
            <div className="month-year-input-container">

                <select className="month-input" value={month} onChange={handleSelectMonthChange}>

                    {meses.map((mes, index) => (
                        <option key={index} value={index + 1}>{mes}</option>
                    ))}

                </select>

                <select className="year-input" value={year} onChange={handleSelectYearChange}> 

                    {anos.map((ano) => (
                        <option key={ano} value={ano}>{ano}</option>
                    ))}

                </select>


            </div>

        </div>
    );

}
