import React from 'react';
import { useState, useEffect } from 'react';

import './style.css';
import LineChartComponent from '../../components/LineChart';
import DoughnutChartComponent from '../../components/DoughnutChart';



// componente que renderizar a página toda (todos os gráficos/componentes)
export default function Graficos() {

  return (
      <div className="GraficosPage">
        <LineChartComponent/>
        <DoughnutChartComponent/>
      </div>
  );

}
