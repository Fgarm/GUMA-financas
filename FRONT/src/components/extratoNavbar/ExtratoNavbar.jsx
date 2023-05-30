import React, { useState } from 'react';
import { Link } from "react-router-dom"
import Graficos from '../../pages/Graficos';

import {
    Navbar,
    Ul,
    Li,
} from './style';


function ExtratoNavbar() {

    const [showComponent, setShowComponent] = useState(false);

    const handleClick = () => {
        setShowComponent(true);
    };

    return (
        <div>
            <Navbar>
                <Ul>
                    <Li><Link to="/Home">Gastos Do Mês</Link></Li>
                    <Li>Saldo</Li>
                    {/* <Li>Grafico</Li> */}
                    <button type="button" onClick={handleClick}><strong>Gráficos</strong></button>
                </Ul>
            </Navbar>

            {showComponent && <Graficos />}

        </div>
    )
}

export default ExtratoNavbar