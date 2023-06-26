import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/sidebar';
import axios from 'axios';
import './style.css'
import CreateGastoGroup from '../../modals/createGastoGrupo';
import AddItemGroupGasto from '../../modals/addItemGroupGasto';
import ShowInfoGroup from '../../modals/showInfoGroup';
import clipboardCopy from 'clipboard-copy';

import { AiOutlinePlus } from "react-icons/ai";
import { GrCircleInformation } from "react-icons/gr";
import { MdClose, MdAddShoppingCart } from "react-icons/md";
import { BsCurrencyDollar } from "react-icons/bs";
import { RiFileCopyLine } from "react-icons/ri";
import { Alert, Icon, Button, useDisclosure, useToast } from '@chakra-ui/react';
import { set } from 'zod';

export default function GroupPage() {
    const [textToCopy, setTextToCopy] = useState('');

    const grupoId = localStorage.getItem('grupo_id');
    const username = localStorage.getItem('cadastro_user');

    const [gastoId, setGastoId] = useState('')
    const [nomeGasto, setNomeGasto] = useState('')
    const [itensGasto, setItensGasto] = useState([])
    // const [pesosGasto, setPesosGasto] = useState([])


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
            })
            .catch(error => {
                console.log(error)
            })
    }

    function getUsuariosGasto() {
        if (gastoId !== '') {
            axios({
                method: "post",
                url: "http://localhost:8000/grupos/usuario-em-gasto/",
                data: {
                    gasto_id: gastoId
                },
            })
                .then(response => {
                    console.log("Usuários do gasto:"+response.data)
                    setUsuariosGastos(response.data)
                    // console.log(usuariosGastos)
                })
                .catch(error => {
                    // console.log(gastoId)
                    console.log(error)
                });
        }
    }

    function getItens() {
        if (gastoId !== '') {
            axios({
                method: "post",
                url: "http://localhost:8000/grupos/itens-gastos/",
                data: {
                    gasto_id: gastoId,
                },
            }).then(response => {
                setItensGasto(response.data)
            }
            ).catch(error => {
                console.log(error)
            })
        }
    }

    // function getPesos() {
    //     if (gastoId !== '') {
    //         axios({
    //             method: "post",
    //             url: "http://localhost:8000/grupos/itens-gastos/",
    //             data: {
    //                 gasto_id: gastoId,
    //             },
    //         }).then(response => {
    //             setPesosGasto(response.data)
    //         }
    //         ).catch(error => {
    //             console.log(error)
    //         })
    //     }
    // }

    function handleGetInfoGasto(gastoGrupo) {
        setGastoId(gastoGrupo.gasto_id)
        setNomeGasto(gastoGrupo.nome)
        getItens()
        getUsuariosGasto()
        setClicks(clicks => clicks + 1)

        setTimeout(() => {
            setClicks(clicks => clicks + 1)
            openGetInfoGasto();
        }, 100);
    }

    useEffect(() => {
        if (gastoId !== '') {
            getUsuariosGasto();
            getItens();
            // getPesos();
        }
    }, [gastoId]);


    // function handleEditGastoGrupo(gastoGrupo) {
    //     setGastoId(gastoGrupo.gasto_id)
    //     setGrupoID(gastoGrupo.grupo_id)
    //     setNomeGasto(gastoGrupo.nome)
    //     getItens()
    //     getUsuariosGasto()
    //     setClicks(clicks => clicks + 1)
    //     setTimeout(() => {
    //         setClicks(clicks => clicks + 1)
    //         openAddItemGastoGrupo();
    //     }, 100);
    // }

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

    const handleCopy = () => {
        clipboardCopy(`http://localhost:5173/join/?grupo=${grupoId}`)
            .then(() => {
                toast({
                    title: 'Link Copiado.',
                    status: 'success',
                    isClosable: true,
                    duration: 3000,
                });
                onClose();
            })
            .catch((error) => {
                console.error('Erro ao copiar o texto:', error);
            });
    };


    return (
        <>

            <Sidebar user={username} />
            <div className='body'>
                {isVisible ? (
                    <Alert >
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <p>Link: http://localhost:5173/join/?grupo={grupoId}</p>
                            <Button
                                className='link-button'
                                ml="auto" // Adicione esta propriedade
                                onClick={() => {
                                    handleCopy();
                                }}
                            >
                                Copiar Link
                            </Button>
                        </div>
                    </Alert>


                ) : (
                    <p></p>
                )}
                <header className='home'>
                    <h1 className='page-title'>Página do Grupo</h1>
                    <div className='button-container'>
                        <Button className='group-button' onClick={handleCreateClick}>
                            <Icon style={{ marginLeft: '-2px', marginRight: '9px' }} as={BsCurrencyDollar} w={5} h={5} />
                            Novo Gasto do Grupo
                        </Button>
                        <Button onClick={onOpen} className='group-button'>
                            <Icon style={{ marginLeft: '-2px', marginRight: '9px' }} as={RiFileCopyLine} w={5} h={5} />
                            Gerar Link
                        </Button>
                    </div>
                </header>

                <div className="gasto_grupo">
                    {gastos.length === 0 ? (
                        <p>Não há gastos com os parâmetros especificados</p>
                    ) : (
                        gastos.map((gasto, index) => {
                            const key = gasto.id || index; // Usando gasto.id ou índice como chave

                            return (
                                <div key={key} className="gasto_information_grupo">
                                    <h1>{gasto.nome}</h1>
                                    <div>
                                        {/* <Icon
                                            as={MdAddShoppingCart}
                                            w={5}
                                            h={5}
                                            mr={2}
                                            onClick={() => handleEditGastoGrupo(gasto)}
                                        /> */}
                                        <Icon
                                            as={GrCircleInformation}
                                            color="black.500"
                                            w={5}
                                            h={5}
                                            onClick={() => handleGetInfoGasto(gasto)}
                                        />
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                <ShowInfoGroup isOpen={isGetInfoGastoOpen} onClose={closeGetInfoGasto} groups_id={grupoId} gasto_id={gastoId} usuariosGastos={usuariosGastos} itensGasto={itensGasto}>
                    <Button onClick={handleGetInfoGasto}>Fechar</Button>
                </ShowInfoGroup>

                <CreateGastoGroup isOpen={isCreateGroupOpen} onClose={closeCreateGroup} handleCreateSuccess={handleCreateSuccess} groups_id={grupoId} userClicked={userClicked} usuariosGastos={usuariosGastos}>
                    <Button onClick={handleClose}>Fechar</Button>
                </CreateGastoGroup>

                <AddItemGroupGasto isOpen={isAddItemGastoGrupoOpen} onClose={closeAddItemGastoGrupo} groups_id={grupoId} nomeGasto={nomeGasto} gastoId={gastoId} usuariosGastos={usuariosGastos} clicks={clicks}>
                    <Button onClick={handleCloseItem}>Fechar</Button>
                </AddItemGroupGasto>
            </div>
        </>
    )
};

