import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/sidebar';
import axios from 'axios';
import { useDisclosure } from '@chakra-ui/react';
import { Button } from "@chakra-ui/react";
import './style.css'
import CreateGastoGroup from '../../modals/createGastoGrupo';
import AddItemGroupGasto from '../../modals/addItemGroupGasto';
import clipboardCopy from 'clipboard-copy';

import { RiFileCopyLine } from "react-icons/ri";
import { MdAddShoppingCart } from "react-icons/md";

import { Alert, AlertDescription, Box, CloseButton, Flex, Icon } from '@chakra-ui/react';

export default function GroupPage() {
    const [textToCopy, setTextToCopy] = useState('');

    const grupoId = localStorage.getItem('grupo_id');
    const [gastoId, setGastoId] = useState('')
    const [grupoID, setGrupoID] = useState('')
    const [nomeGasto, setNomeGasto] = useState('')

    const username = localStorage.getItem('cadastro_user');

    const [gastos, setGastos] = useState([]);
    const [flag, setFlag] = useState(0);
    const [userClicked, setUserClicked] = useState(0);


    const { isOpen: isCreateGroupOpen, onOpen: openCreateGroup, onClose: closeCreateGroup } = useDisclosure();
    const { isOpen: isAddItemGastoGrupoOpen, onOpen: openAddItemGastoGrupo, onClose: closeAddItemGastoGrupo } = useDisclosure();

    useEffect(() => {
        getGroupInfo();
    }, [flag]);

    function handleEditGastoGrupo(gastoGrupo) {
        setGastoId(gastoGrupo.gasto_id)
        setGrupoID(gastoGrupo.grupo_id)
        setNomeGasto(gastoGrupo.nome)
        openAddItemGastoGrupo()
    }

    function handleCloseItem() {
        closeAddItemGastoGrupo()
    }

    const handleCreateClick = () => {
        setUserClicked(userClicked + 1)
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

    const {
        isOpen: isVisible,
        onClose,
        onOpen,
    } = useDisclosure({ defaultIsOpen: false })

    function alert() {
        onClose()
    }

    function handleCopy() {
        clipboardCopy(`http://localhost:5173/join/?grupo=${grupoId}`)
            .then(() => {
                console.log('Texto copiado com sucesso!');
            })
            .catch((error) => {
                console.error('Erro ao copiar o texto:', error);
            });
    }

    return (

        <div>
            {isVisible ? (
                <Alert>Link: http://localhost:5173/join/?grupo={grupoId} 
                    <Icon as={RiFileCopyLine} w={5} h={5} mr={2} onClick={handleCopy} />
                    <button className="alert" onClick={alert}>X</button>
                </Alert>
            ) : 
            <Button onClick={onOpen}>Gerar Link</Button>}

            <Button onClick={handleCreateClick}>Criar Gasto do Grupo</Button>
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
                                    onClick={() => handleEditGastoGrupo(gasto)}
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

            <CreateGastoGroup isOpen={isCreateGroupOpen} onClose={closeCreateGroup} handleCreateSuccess={handleCreateSuccess} groups_id={grupoId} userClicked={userClicked}>
                <Button onClick={handleClose}>Fechar</Button>
            </CreateGastoGroup>

            <AddItemGroupGasto isOpen={isAddItemGastoGrupoOpen} onClose={closeAddItemGastoGrupo} groups_id={grupoID} nomeGasto={nomeGasto} gastoId={gastoId} >
                <Button onClick={handleCloseItem}>Fechar</Button>
            </AddItemGroupGasto>
        </div>
    )
};

