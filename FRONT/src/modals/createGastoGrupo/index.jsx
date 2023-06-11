import React, { useState, useEffect } from 'react';

// import AddItemGroupGasto from '../../modals/addItemGroupGasto';
import PeopleInput from '../../components/peopleInput';
import {
  Button,
  ChakraProvider,
  Checkbox,
  FormLabel,
  FormControl,
  FormHelperText,
  Flex,
  Grid,
  GridItem,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  ModalHeader,
  Stack,
  useDisclosure,
} from '@chakra-ui/react'

import axios from 'axios'

import './style.css'

export default function CreateGastoGroup({ isOpen, onClose, initialRef, finalRef, groups_id, handleCreateSuccess, userClicked, usuariosGastos }) {

  const grupoId = localStorage.getItem('grupo_id');
  const token = localStorage.getItem('token');

  const [mostrarBotao, setMostrarBotao] = useState(true)
  const [mostrarDiv, setMostrarDiv] = useState(false)

  const [itensList, setItensList] = useState({})
  const [users, setUsers] = useState([]);
  
  const [nome, setNome] = useState('');
  const [custo, setCusto] = useState(0);
  const [pesos, setPesos] = useState('');
  const [quantidade, setQuantidade] = useState(0);
  const [usuariosGrupo, setUsuariosGrupo] = useState([{ username: 'teste' }]);

  useEffect(() => {
    getUsuarios()
  }, [userClicked])

  // Tenho que verificar o que fazer aqui 
  function handleItens() {
    const newTag = { nome, usuariosGrupo, custo, pesos, quantidade }
  }

  function getUsuarios() {
    axios({
      method: "post",
      url: "http://localhost:8000/grupos/usuarios-grupo/",
      data: {
        grupo_id: groups_id,
      },
    }).then(response => {
      setUsuariosGrupo(response.data)
      console.log(response.data)
    }
    ).catch(error => {
      console.log(error)
    })
  }

  function handleUsuariosChange(usuarios) {
    setUsers(usuarios)
    console.log(usuarios)
  }

  function handleSubmit() {

    const data = {
      nome_gasto: nome,
      id_grupo_id: groups_id,
      usuarios: users
    }

    console.log(data)

    axios.post('http://localhost:8000/grupos/cadastrar-gasto-grupo/', data)

      .then(response => {
        if (response.status === 200) {
          onClose()
          handleCreateSuccess()
        } else if (response.status === 409) {
          alert('Grupo de nome já cadastrado no sistema')
        } else if (response.status === 400) {
          alert('Dados de cadastro não estão nos parâmetros aceitos')
        } else {
          alert('Erro de solicitação')
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  function addGastoGroupUser() {
    axios({
      method: "post",
      url: "http://localhost:8000/grupos/associar-user-grupoGastos/",
      data: {
        grupo_id: grupoId
      },
    })
      .then((response) => {
        setUsers(response.data);
        console.log(grupoId)
        console.log(users)
        setShouldRunEffect(true)
      })
      .catch(error => {
        console.log(error);
      })
  }

  function handleButtonClick() {
    setMostrarDiv(!mostrarDiv);
    setMostrarBotao(!mostrarBotao);
  }

  function handleExitButton() {
    onClose();
    setMostrarDiv(false);
    setMostrarBotao(true);
  }

  function CheckboxList({ usuariosGrupo }) {
    return (
      <Stack spacing={2}>
        {usuariosGrupo && usuariosGrupo.map((user) => (
          <FormControl>
            <ChakraProvider>
              <Grid templateColumns="1fr 1fr" gap={4}>
                <GridItem>
                  <Checkbox key={user.id}>{user.nome}</Checkbox>
                </GridItem>
                <GridItem>
                  <Input placeholder="Peso" _placeholder={{ color: 'inherit' }} borderColor="black" focusBorderColor="black" />
                </GridItem>
              </Grid>
            </ChakraProvider>
          </FormControl>
        ))}
      </Stack>
    );
  }

  return (

    <div>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            mb={0}
            className='modal_header'>
            Criando Gasto do Grupo
          </ModalHeader>

          <ModalBody>
            <FormControl mt={4}>
              <FormLabel>Nome</FormLabel>
              <Input onChange={(e) => {
                setNome(e.target.value)
              }} _placeholder={{ color: 'inherit' }} borderColor="black" focusBorderColor="black" />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Usuários</FormLabel>
              <PeopleInput onUsuariosChange={handleUsuariosChange} usuarios={usuariosGrupo} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Itens</FormLabel>

              {mostrarBotao && <Button
                style={{ background: '#6F9951' }}
                mr={3}
                onClick={handleButtonClick}
              > Novo Item </Button>}

              {mostrarDiv && (
                <div>
                  <FormControl>
                    <Input onChange={(e) => {
                      setNomeItem(e.target.value)
                    }}
                    placeholder='Nome do item' _placeholder={{ color: 'inherit' }} borderColor="black" focusBorderColor="black" />
                    {/* <FormHelperText>We'll never share your email.</FormHelperText> */}
                  </FormControl>
                  <br></br>
                  <FormControl>
                    <ChakraProvider>
                      <Grid templateColumns="1fr 1fr" gap={4}>
                        <GridItem>
                          <Input onChange={(e) => {
                            setCusto(e.target.value)
                          }} 
                          placeholder="Custo" _placeholder={{ color: 'inherit' }} borderColor="black" focusBorderColor="black" />
                        </GridItem>
                        <GridItem>
                          <Input onChange={(e) => {
                            setQuantidade(e.target.value)
                          }}
                          placeholder="Quantidade" _placeholder={{ color: 'inherit' }} borderColor="black" focusBorderColor="black" />
                        </GridItem>
                      </Grid>
                    </ChakraProvider>
                  </FormControl>
                  <br></br>
                  <FormLabel>Participantes e consumo</FormLabel>
                  <div>
                    <CheckboxList usuariosGrupo={usuariosGrupo} />
                  </div>
                  <br></br>
                  <Flex justifyContent="flex-start">
                    <Button marginRight="0.5rem">Cadastrar Item</Button>
                    <Button marginRight="0.5rem" onClick={handleButtonClick}>Excluir</Button>
                  </Flex>

                </div>
              )}

            </FormControl>

          </ModalBody>

          <ModalFooter>

            <Button
              style={{ background: '#6F9951' }}
              mr={3}
              onClick={handleSubmit}>
              Criar
            </Button>
            <Button onClick={handleExitButton}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>

  );
}