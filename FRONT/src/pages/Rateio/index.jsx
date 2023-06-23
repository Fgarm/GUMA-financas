import React from 'react';

import './style.css';
import '../../main.css';
import LineChartComponent from '../../components/LineChart';
import DoughnutChartComponent from '../../components/DoughnutChart';
import Sidebar from '../../components/sidebar';
import BarChartComponent from '../../components/BarChart';


// componente que renderiza a página Dasboard (todos os gráficos/componentes)
export default function RateioPage() {

  const username = localStorage.getItem('cadastro_user');

  return (
      <>
        <Sidebar user={username} />
        <div className="RateioPage">


          <header className='home'>
                  
            <h1 className='page-title'>Rateio</h1>

            <div className='new-tag-and-gasto-button-container'>
                {/* <Button className='new-tag-and-gasto-button' onClick={handleCreateClick}>
                    <Icon style={{marginLeft: '-2px', marginRight: '9px'}} as={BsCurrencyDollar} w={5} h={5}/>
                    Novo Gasto do Grupo
                </Button> */}
            </div>

          </header>



          <div className='body-rateio'>
            
            <div className='left-container'>
                
                <div className='container-devendo'></div>
                <div className='container-receber'></div>
                {/* <LineChartComponent/>
                <DoughnutChartComponent/> */}
            </div>

            <div className='right-container'>
                <div className='container-resumo-total'></div>
              
                {/* <BarChartComponent/> */}
            </div>

          </div>

        
        
        </div>
      </>
  );

}
