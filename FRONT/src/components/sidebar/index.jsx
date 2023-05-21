import React, { useState, useEffect } from 'react';
import "./style.css";

import { Icon } from "@chakra-ui/react";
import { BiLogOut } from "react-icons/bi";
import { MdGroups } from "react-icons/md";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';

import Groups from "../../modals/createGroup";
import { useDisclosure } from '@chakra-ui/react';
import { Button } from "@chakra-ui/react";

import { BsBarChartFill } from "react-icons/bs";

import axios from 'axios';

export default function Sidebar(props) {
    const [grupos, setGrupos] = useState([]);
    const user = localStorage.getItem('cadastro_user');
    const [message, setMessage] = useState(false)

    function teste(){
        console.log("dasdasdsa")
        setMessage(!message)
    }

    function getUserGroups() {
        axios({
            method: "post",
            url: "http://localhost:8000/grupos/grupos-usuario/",
            data: {
                username: user
            },
        }).then(response => {
            setGrupos(response.data)
            console.log(user)
            console.log(response.data)
        })
            .catch(error => {
                console.log(error)
            })
    }

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

    function handleStatistics() {
        navigate('/statistics');
    }

    return (
        <div className="sidenav">
            <p className="presentation">Olá, {props.user}</p>

            <div
                className="flex"
                onClick={handleCreateClick}>
                <Icon as={AiOutlineUsergroupAdd} w={7} h={7} color="green.500" /> Criar Grupo
            </div>
            <div className="flex" onClick={handleStatistics}>
                <Icon as={BsBarChartFill} w={7} h={7} color="blue.500" /> Análise de Gastos
            </div>
            <div className="flex" onClick={teste}>
                <Icon as={MdGroups} w={7} h={7} color="black.500"/> Grupos
                {/* {grupos.length === 0 ? <p></p> :
                    (
                        grupos.map((grupo, key) => (
                            <div className="flex">
                                <Icon as={MdGroups} w={7} h={7} /> {grupo.nome}
                            </div>

                        ))
                    )} */}
            </div>
                <Groups isOpen={isCreateGroupOpen} onClose={closeCreateGroup}>
                    <Button onClick={handleClose}>Fechar</Button>
                </Groups>

 
            {message == true ? <p>ola mundo</p> : ""}

            <div className="flex" onClick={handleLogOut}>
                <Icon as={BiLogOut} w={7} h={7} color="red.500" /> Sair
            </div>
        </div>
    )
}