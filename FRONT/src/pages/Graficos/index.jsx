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
      <>
        <Sidebar user={username} />
        <div className="GraficosPage">
          <header className='home'>
                  
            <h1 className='page-title'>Dashboard</h1>

            <div className='new-tag-and-gasto-button-container'>
                {/* <Button className='new-tag-and-gasto-button' onClick={handleCreateClick}>
                    <Icon style={{marginLeft: '-2px', marginRight: '9px'}} as={BsCurrencyDollar} w={5} h={5}/>
                    Novo Gasto do Grupo
                </Button> */}
            </div>

          </header>

          <div className='body-dashboard'>
            <LineChartComponent/>
            <DoughnutChartComponent/>
          </div>

        </div>
      </>
  );

}
