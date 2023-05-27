import React, { useState, useEffect } from 'react';
import "./style.css";
import { useNavigate } from 'react-router-dom';

import { Icon } from "@chakra-ui/react";
import { BiLogOut } from "react-icons/bi";
import { MdGroups } from "react-icons/md";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import { BsBarChartFill } from "react-icons/bs";
import { BsFillBarChartLineFill } from "react-icons/bs";

import { BsCurrencyDollar } from "react-icons/bs"; // $
import { BsCurrencyBitcoin } from "react-icons/bs"; // B do bitcoin
import { BsCashCoin } from "react-icons/bs"; // uma nota e uma moeda

import { BsCoin } from "react-icons/bs"; // uma moeda
import { BsCashStack } from "react-icons/bs"; // uma nota normal com outra atras (tipo um bolo de din)
import { BsCash } from "react-icons/bs"; // só uma nota (igual o de cima, mas só uma)

// import { BsFillBagCheckFill } from "react-icons/bs"; // uma sacola com check
// import { BsFillBagDashFill } from "react-icons/bs"; // uma sacola com um menos (-)
// import { BsFillBagFill } from "react-icons/bs"; // so a sacola
// import { BsFillBagHeartFill } from "react-icons/bs";
// import { BsFillBagPlusFill } from "react-icons/bs";
// import { BsFillBagXFill } from "react-icons/bs";


import Groups from "../../modals/createGroup";
import { useDisclosure } from '@chakra-ui/react';
import { Button } from "@chakra-ui/react";


import axios from 'axios';
import { BsFillTagFill } from 'react-icons/bs';

export default function Sidebar(props) {

    const [grupos, setGrupos] = useState([]);
    const user = localStorage.getItem('cadastro_user');
    const [showGroup, setShowGroup] = useState(false)
    const [activeButton, setActiveButton] = useState(null);

    const navigate = useNavigate();

    function navigateGroup(id) {
        console.log("navigate")
        console.log(id)
        localStorage.setItem('grupo_id', id)
        navigate('/group');
    }

    function getGroupsUser() {
        axios({
            method: "post",
            url: "http://localhost:8000/grupos/grupos-usuario/",
            data: {
                username: user
            },
        }).then(response => {
            setGrupos(response.data)
            console.log(response.data)
            setShowGroup(!showGroup)
        })
            .catch(error => {
                console.log(error)
            })
    }

    const { isOpen: isCreateGroupOpen, onOpen: openCreateGroup, onClose: closeCreateGroup } = useDisclosure();

    const handleCreateClick = () => {
        openCreateGroup();
        // setState cor da fonte
    };
    
    const handleClose = () => {
        closeCreateGroup();
        // setState cor da fonte = false
    };

    const handleLogOut = () => {
        console.log('logout')
        // setState cor da fonte
        localStorage.removeItem('cadastro_user')
        localStorage.removeItem('token')
        navigate('/');
    }

    function handleStatistics() {
        navigate('/extratos');
    }

    function handleMyExpenses() {
        navigate('/home');
    }
    
    function handleDashboard() {
        navigate('/dashboard');
    }

    return (
        <div className="sidebar">

            <div className="container-logo-username">
                <img src="../../../guma1.png" className="guma-logo" alt="GUMA Logo"/>
                <p className="presentation">Olá,<br></br>{props.user}</p>
            </div>

            <div className="subtitle-sidebar">ANALYTICS</div>

            {/* <div className="flex" onClick={handleStatistics}>
                <Icon as={BsBarChartFill} w={5} h={5}  /> Análise de Gastos
            </div> */}
            
            <div className="flex" onClick={handleMyExpenses}>
                <Icon as={BsCurrencyDollar} w={5} h={5}  /> Meus Gastos
            </div>
            
            <div className="flex" onClick={handleMyExpenses}>
                <Icon as={BsCashStack} w={5} h={5}  /> Saldo
            </div>

            <div className="flex" onClick={handleDashboard}>
                <Icon as={BsBarChartFill} w={5} h={5}  /> Gráficos
            </div>


            
            <div className="subtitle-sidebar grupos">GRUPOS</div>
            
            <div
                className="flex"
                onClick={handleCreateClick}>
                <Icon as={AiOutlineUsergroupAdd} w={6} h={6}  /> Novo Grupo
            </div>
            <div className="flex" onClick={getGroupsUser}>
                <Icon as={MdGroups} w={6} h={6} /> Grupos
                    
                {showGroup == true ? <Icon as={RiArrowDropUpLine} w={7} h={7} /> : <Icon as={RiArrowDropDownLine} w={7} h={7}/>}
            </div>
                <Groups isOpen={isCreateGroupOpen} onClose={closeCreateGroup} user={user}>
                    <Button onClick={handleClose}>Fechar</Button>
                </Groups>

                {showGroup && grupos.length !== 0 ? (
                        grupos.map((grupo, key) => (
                    <div className="flex" onClick={() => navigateGroup(grupo.grupo_id)}>
                        <Icon as={MdGroups} w={5} h={5} /> {grupo.nome}
                    </div>
                        ))
                    ) : null}

            <div className="flex logout" style={{marginLeft: '10%'}} onClick={handleLogOut}>
                <Icon as={BiLogOut} w={6} h={6}  /> Logout
            </div>
        </div>
    )
}
