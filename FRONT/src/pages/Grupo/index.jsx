import React, {useEffect, useState} from 'react';
import Sidebar from '../../components/sidebar';
import axios from 'axios';
import { useDisclosure } from '@chakra-ui/react';
import { Button } from "@chakra-ui/react";
import './style.css'
import CreateGastoGroup from '../../modals/createGastoGrupo';
import { MdAddShoppingCart } from "react-icons/md";

import { Icon } from '@chakra-ui/react';

export default function GroupPage() {

    const grupoId = localStorage.getItem('grupo_id');

    const username = localStorage.getItem('cadastro_user');

    const [gastos, setGastos] = useState([]);
    const [flag, setFlag] = useState(0);
    
    const { isOpen: isCreateGroupOpen, onOpen: openCreateGroup, onClose: closeCreateGroup } = useDisclosure();

    const handleCreateClick = () => {
        openCreateGroup();
    };

    const handleClose = () => {
        closeCreateGroup();
    };

    const handleCreateSuccess = () => {
        setFlag(flag + 1);
    }

    function getGroupInfo() {
        axios({
            method: "post",
            url: "http://localhost:8000/grupos/gastos-grupo/",
            data: {
                grupo_id: grupoId
            },
        })
        .then(response => {
            setGastos(response.data)
            console.log(response.data)
        })
        .catch(error => {
            console.log(error)
        })
    }

    useEffect(() => {
        getGroupInfo();
    }, [flag]);

    return (
        <div>   
            <Button onClick={handleCreateClick}>Get Group Info</Button>
            <h1>GroupPage</h1>

            <div className="gasto">
            {gastos.length === 0 ? <p>Não há gastos com os parâmetros especificados</p> : (
                gastos.map((gasto, key) => (
                    <div key={gasto.id} className="gasto_information">
                        <h1>{gasto.nome}</h1>
                        <div>
                            <Icon 
                                as={MdAddShoppingCart}
                                w={5} 
                                h={5} 
                                mr={2} 
                                onClick={() => handleEditClick(gasto)} 
                            />
                            <Icon 
                                color='red.500' 
                                w={5} 
                                h={5} 
                                onClick={() => handleDeleteClick(gasto.id)} 
                            />
                    </div>
                    </div>
                ))
            )}
      </div>

            <CreateGastoGroup isOpen={isCreateGroupOpen} onClose={closeCreateGroup} handleCreateSuccess={handleCreateSuccess} groups_id={grupoId}>
                    <Button onClick={handleClose}>Fechar</Button>
            </CreateGastoGroup>
        </div>
    )
};

