import React from "react";
import "./style.css";

import { Icon } from "@chakra-ui/react";
import { BiLogOut } from "react-icons/bi";
import { AiOutlineUsergroupAdd } from "react-icons/ai";

import { useNavigate } from 'react-router-dom';

import Groups from "../../modals/createGroup";
import { useDisclosure } from '@chakra-ui/react';
import { Button } from "@chakra-ui/react";

import { BsBarChartFill } from "react-icons/bs";

import axios from 'axios';

export default function Sidebar(props){

    /*
    função para requisição de grupos
    */

    const { isOpen: isCreateGroupOpen, onOpen: openCreateGroup, onClose: closeCreateGroup } = useDisclosure();

    const handleCreateClick = () => {
        openCreateGroup();
    };

    const handleClose = () => {
        closeCreateGroup();
    };


    const navigate = useNavigate();

    const handleLogOut = () => {
        console.log('logout')
        localStorage.removeItem('cadastro_user')
        localStorage.removeItem('token')
        navigate('/');
    }

    function handleStatistics(){
        navigate('/statistics');
    }

    return(
        <div className="sidenav">
            <p>Olá, {props.user}</p>

            <div 
            className="flex" 
            onClick={handleCreateClick}>
                <Icon as={AiOutlineUsergroupAdd} w={7} h={7} color="green.500" /> Criar Grupo
            </div>
            <div className="flex" onClick={handleStatistics}>
                <Icon as={BsBarChartFill} w={7} h={7} color="blue.500" /> Análise de Gastos
            </div>
            <div className="flex" onClick={handleLogOut}>
                <Icon as={BiLogOut} w={7} h={7} color="red.500" /> Sair
            </div>
            {/*
            map dos grupos*/
            }
            <Groups isOpen={isCreateGroupOpen} onClose={closeCreateGroup}>
                <Button onClick={handleClose}>Fechar</Button>
            </Groups>
        </div>
    )
}
