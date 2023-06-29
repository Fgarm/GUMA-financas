import React, { useState, useEffect } from 'react';

import './style.css';
import '../../main.css';
import LineChartComponent from '../../components/LineChart';
import DoughnutChartComponent from '../../components/DoughnutChart';
import Sidebar from '../../components/sidebar';
import BarChartComponent from '../../components/BarChart';
   
import axios from 'axios';

// componente que renderiza a página do Rateio
export default function RateioPage() {

  const username = localStorage.getItem('cadastro_user');

  const [relacao_devedores, setDevendo] = useState([]);

  const getDevendo = () => {
    axios({
      method: "post",
      url: "http://localhost:8000/debitos-grupo/obter-devedores",
      data: {
        user: username
      },
    })
      .then((response) => {
        const data = response.data;
        setDevendo(data);
        console.log(response.data)
      })
      .catch(error => {
        console.log(error);
      })
  }

  useEffect(() => {
    getDevendo();
  }, []);

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

            <div className='container-devendo'>
              <div className='container-titles-rateio'>
                <h3 className='titles-rateio'>Para Quem Eu Devo</h3>
              </div>

              <div className='body-devendo'>
                {relacao_devedores.map((devedor, key) => (
                  <div key={devedor.id} className="gasto_information ratieio-info">
                    <p>{devedor.nome}</p>
                    <p>
                      {devedor.valor > 0 ? (
                        <p style={{ color: '#6F9951', fontWeight: 'bold' }}>
                          + R$ {devedor.valor}{' '}
                        </p>
                      ) : (
                        <p style={{ color: 'red', fontWeight: 'bold' }}>
                          - R$ {devedor.valor * -1}{' '}
                        </p>
                      )}
                    </p>
                    <p>
                      {devedor.pago == null ? (
                        ''
                      ) : devedor.pago > 0 ? (
                        <p style={{ color: '#6F9951', fontWeight: 'bold' }}>
                          Pago
                        </p>
                      ) : (
                        <p style={{ color: 'red', fontWeight: 'bold' }}>
                          Não Pago
                        </p>
                      )}
                    </p>
                  </div>
                ))}
              </div>

            </div>

            <div className='container-receber'>

              <div className='container-titles-rateio'>
                <h3 className='titles-rateio'>Quanto Tenho a Receber</h3>
              </div>

              <div className='body-devendo'>
                {gastos.map((gasto, key) => (
                  <div key={gasto.id} className="gasto_information">
                    <p>{gasto.nome}</p>
                    <p>
                      {gasto.valor > 0 ? (
                        <p style={{ color: '#6F9951', fontWeight: 'bold' }}>
                          + R$ {gasto.valor}{' '}
                        </p>
                      ) : (
                        <p style={{ color: 'red', fontWeight: 'bold' }}>
                          - R$ {gasto.valor * -1}{' '}
                        </p>
                      )}
                    </p>
                    <p>
                      {gasto.pago == null ? (
                        ''
                      ) : gasto.pago > 0 ? (
                        <p style={{ color: '#6F9951', fontWeight: 'bold' }}>
                          Pago
                        </p>
                      ) : (
                        <p style={{ color: 'red', fontWeight: 'bold' }}>
                          Não Pago
                        </p>
                      )}
                    </p>
                  </div>
                ))}
              </div>

            </div>

            {/* <LineChartComponent/>
                <DoughnutChartComponent/> */}

          </div>






          <div className='right-container'>

            <div className='container-resumo-total'>

              <div className='title-container-resumo-total'>
                <h3 className='titles-rateio'>Resumo Total</h3>
              </div>

              <div className='body-resumo-total'>

                <div className='por-pessoa'>
                  <div className='container-titles-rateio container-title-resumo-total'>
                    <h3 className='titles-rateio titles-resumo-total'>Por Pessoa</h3>
                  </div>

                  <div className='body-devendo'>
                    {gastos.map((gasto, key) => (
                      <div key={gasto.id} className="gasto_information">
                        <p>{gasto.nome}</p>
                        <p>
                          {gasto.valor > 0 ? (
                            <p style={{ color: '#6F9951', fontWeight: 'bold' }}>
                              + R$ {gasto.valor}{' '}
                            </p>
                          ) : (
                            <p style={{ color: 'red', fontWeight: 'bold' }}>
                              - R$ {gasto.valor * -1}{' '}
                            </p>
                          )}
                        </p>
                        <p>
                          {gasto.pago == null ? (
                            ''
                          ) : gasto.pago > 0 ? (
                            <p style={{ color: '#6F9951', fontWeight: 'bold' }}>
                              Pago
                            </p>
                          ) : (
                            <p style={{ color: 'red', fontWeight: 'bold' }}>
                              Não Pago
                            </p>
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className='por-gasto-grupo'>
                  <div className='container-titles-rateio container-title-resumo-total'>
                    <h3 className='titles-rateio titles-resumo-total'>Por Gasto em Grupo</h3>
                  </div>

                  <div className='body-devendo'>
                    {gastos.map((gasto, key) => (
                      <div key={gasto.id} className="gasto_information">
                        <p>{gasto.nome}</p>
                        <p>
                          {gasto.valor > 0 ? (
                            <p style={{ color: '#6F9951', fontWeight: 'bold' }}>
                              + R$ {gasto.valor}{' '}
                            </p>
                          ) : (
                            <p style={{ color: 'red', fontWeight: 'bold' }}>
                              - R$ {gasto.valor * -1}{' '}
                            </p>
                          )}
                        </p>
                        <p>
                          {gasto.pago == null ? (
                            ''
                          ) : gasto.pago > 0 ? (
                            <p style={{ color: '#6F9951', fontWeight: 'bold' }}>
                              Pago
                            </p>
                          ) : (
                            <p style={{ color: 'red', fontWeight: 'bold' }}>
                              Não Pago
                            </p>
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

            {/* <BarChartComponent/> */}
          </div>

        </div>



      </div>
    </>
  );

}
