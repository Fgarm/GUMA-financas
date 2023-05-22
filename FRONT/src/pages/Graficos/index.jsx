import React from 'react';
import { useState, useEffect } from 'react';

import './style.css';
import LineChartComponent from '../../components/LineChart';
import DoughnutChartComponent from '../../components/DoughnutChart';



// criar componente gráfico doughnut para os gastos mais relevantes
export default function Graficos() {

  return (
      <div className="GraficosPage">
        <DoughnutChartComponent/>
        <LineChartComponent/>
      </div>
  );

}

// criar componente para renderizar a página toda (todos os gráficos/componentes) - que é de fato o que deveria estar aqui, o resto deveria estar em componentes