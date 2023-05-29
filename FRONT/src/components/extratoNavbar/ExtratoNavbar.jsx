import React from 'react';
import { Link } from "react-router-dom"

import { Navbar,
         Ul, 
         Li,
         ContUl,
        } from './style';

function ExtratoNavbar(){
    return(
        <div>
            <ContUl>
                <Navbar>
                    <Ul>
                        <Li><Link to="/Home">Gastos Do Mês</Link></Li>
                        <Li><Link to="/extratos/saldos">Saldo</Link></Li>
                        <Li>Grafico</Li>
                    </Ul>
                </Navbar>
            </ContUl>
        </div>
    )
}

export default ExtratoNavbar

