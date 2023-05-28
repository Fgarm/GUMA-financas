import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/sidebar';
import axios from 'axios';
import './style.css'
import CreateGastoGroup from '../../modals/createGastoGrupo';
import AddItemGroupGasto from '../../modals/addItemGroupGasto';
import clipboardCopy from 'clipboard-copy';

import { AiOutlinePlus } from "react-icons/ai";
import { MdClose, MdAddShoppingCart } from "react-icons/md";

import { Alert, Icon, Button, useDisclosure, useToast } from '@chakra-ui/react';
import { set } from 'zod';

export default function GroupPage() {

    const grupoId = localStorage.getItem('grupo_id');
    const [gastoId, setGastoId] = useState('')
    const [grupoID, setGrupoID] = useState('')
    const [nomeGasto, setNomeGasto] = useState('')
    const [isClicked, setIsClicked] = useState(false);
    const username = localStorage.getItem('cadastro_user');

    const [clicks, setClicks] = useState(0);
    
    const [gastos, setGastos] = useState([]);
    const [userClicked, setUserClicked] = useState(0);
    const [usuariosGastos, setUsuariosGastos] = useState([])
    
    const [flag, setFlag] = useState(0);
    const handleCreateSuccess = () => {
        setFlag(flag + 1);
    }
    
    const { isOpen: isCreateGroupOpen, onOpen: openCreateGroup, onClose: closeCreateGroup } = useDisclosure();
    const { isOpen: isAddItemGastoGrupoOpen, onOpen: openAddItemGastoGrupo, onClose: closeAddItemGastoGrupo } = useDisclosure();
    const { isOpen: isGetInfoGastoOpen, onOpen: openGetInfoGasto, onClose: closeGetInfoGasto } = useDisclosure();
    const {
        isOpen: isVisible,
        onClose,
        onOpen,
    } = useDisclosure({ defaultIsOpen: false })
    
    const toast = useToast()

    useEffect(() => {
        getGroupInfo();
    }, [flag]);

    function getUsuariosGasto(){
        if (gastoId !== '') {
            axios({
              method: "post",
              url: "http://localhost:8000/grupos/usuario-em-gasto/",
              data: {
                gasto_id: gastoId
              },
            })
              .then(response => {
                    console.log("Usuários do gasto:")
                    setUsuariosGastos(response.data)
                    console.log(usuariosGastos)
              })
              .catch(error => {
                console.log(error)
              });
          }
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

    function handleGetInfoGasto(gasto) {
        setGastoId(gasto.gasto_id)
        setGrupoID(gasto.grupo_id)
        setNomeGasto(gasto.nome)
        setTimeout(() => {
            // Código para abrir o modal aqui
        }, 100);
    }

    useEffect(() => {
        if (gastoId !== '') {
            console.log("Gasto ID NOVO:")
            console.log(gastoId)
            getUsuariosGasto();
        }
      }, [gastoId]);


    function handleEditGastoGrupo(gastoGrupo) {
        setGastoId(gastoGrupo.gasto_id)
        setGrupoID(gastoGrupo.grupo_id)
        setNomeGasto(gastoGrupo.nome)
        
        // getUsuariosGasto()
        setTimeout(() => {
            setClicks(clicks => clicks + 1)
            openAddItemGastoGrupo();
        }, 150); 
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


    function alert() {
        onClose()
    }

    function handleCopy() {
        setIsClicked(!isClicked);
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
                    <Button className='buttonCopy'
                        onClick={() => {
                            toast({
                                title: 'Link Copiado.',
                                status: 'success',
                                isClosable: true,
                            })
                            handleCopy()
                        }
                        }
                    >
                        Copiar Link
                    </Button>
                    <Icon as={MdClose} w={5} h={5} mr={2} className="alert" onClick={alert}/>
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
                                    as={AiOutlinePlus}
                                    color='black.500'
                                    w={5}
                                    h={5}
                                    onClick={() => handleGetInfoGasto(gasto)}
                                />
                            </div>
                        </div>
                    ))
                )}
            </div>

            <CreateGastoGroup isOpen={isCreateGroupOpen} onClose={closeCreateGroup} handleCreateSuccess={handleCreateSuccess} groups_id={grupoId} userClicked={userClicked}>
                <Button onClick={handleClose}>Fechar</Button>
            </CreateGastoGroup>

            <AddItemGroupGasto isOpen={isAddItemGastoGrupoOpen} onClose={closeAddItemGastoGrupo} groups_id={grupoID} nomeGasto={nomeGasto} gasto_Id={gastoId} usuariosGastos={usuariosGastos} clicks={clicks}>
                <Button onClick={handleCloseItem}>Fechar</Button>
            </AddItemGroupGasto>
        </div>
    )
};

