import React from 'react';

import './style.css';
import '../../main.css';
import LineChartComponent from '../../components/LineChart';
import DoughnutChartComponent from '../../components/DoughnutChart';
import Sidebar from '../../components/sidebar';



// componente que renderiza a página toda (todos os gráficos/componentes)
export default function Graficos() {

  const username = localStorage.getItem('cadastro_user');

  return (
      <div className="GraficosPage">
        <Sidebar user={username} />
        <LineChartComponent/>
        <DoughnutChartComponent/>
      </div>
  );

}
