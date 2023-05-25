import React from 'react';
import { Link } from "react-router-dom"

import { Navbar,
         Ul, 
         Li,
        } from './style';

function ExtratoNavbar(){
    return(
        <div>
            <Navbar>
                <Ul>
                    <Li><Link to="/Home">Gastos Do Mês</Link></Li>
                    <Li>Saldo</Li>
                    <Li>Grafico</Li>
                </Ul>
            </Navbar>
        </div>
    )
}

export default ExtratoNavbar

