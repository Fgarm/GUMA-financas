import React, { useState, useEffect } from 'react';
import { MdOutlineModeEditOutline, MdDelete } from 'react-icons/md';
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
  Icon,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  ModalHeader,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react'

import axios from 'axios'

import './style.css'

export default function CreateGastoGroup({ isOpen, onClose, initialRef, finalRef, groups_id, handleCreateSuccess, userClicked, usuariosGastos }) {

  const grupoId = localStorage.getItem('grupo_id');
  const token = localStorage.getItem('token');

  const [mostrarItem, setmostrarItem] = useState(true)
  const [mostrarDiv, setMostrarDiv] = useState(false)

  // const [itensList, setItensList] = useState({})
  const [users, setUsers] = useState([]);
  const [nomeItem, setNomeItem] = useState('');
  const [nome, setNome] = useState('');
  const [custo, setCusto] = useState(0);
  // const [pesos, setPesos] = useState('');
  const [quantidade, setQuantidade] = useState(0);
  const [usuariosGrupo, setUsuariosGrupo] = useState([{ username: 'teste' }]);
  const [usuariosSelecionados, setUsuariosSelecionados] = useState([])

  useEffect(() => {
    getUsuarios()
  }, [userClicked])


  function getUsuarios() {
    axios({
      method: "post",
      url: "http://localhost:8000/grupos/usuarios-grupo/",
      data: {
        grupo_id: groups_id,
      },
    }).then(response => {
      setUsuariosGrupo(response.data)
      console.log("AQUI")
      // console.log(response.data)
    }
    ).catch(error => {
      console.log(error)
    })
  }

  function handleUsuariosChange(username, name) {
    setUsers(username)
    setUsuariosSelecionados(name)
    // console.log(username)
    // console.log("Itens")
    console.log(name)
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
    setmostrarItem(!mostrarItem);
  }

  function handleExitButton() {
    onClose();
    setMostrarDiv(false);
    setmostrarItem(true);
  }

  // Teste de inputs

  const [itensSelecionados, setItensSelecionados] = useState([]);
  const [pesos, setPesos] = useState({});


  const handleCheckboxChange = (id) => {
    setItensSelecionados((selecionados) => {
      if (selecionados.includes(id)) {
        return selecionados.filter((item) => item !== id);
      } else {
        return [...selecionados, id];
      }
    });
  };


  const handlePesosChange = (userId, peso) => {
    setPesos((pesos) => ({
      ...pesos,
      [userId]: peso,
    }));
  };

  function CheckboxList({ usuariosGrupo }) {
    return (
      <Stack spacing={2}>
        {usuariosGrupo &&
          usuariosGrupo.map((user) => (
            <FormControl key={user.id}>
              <ChakraProvider>
                <Grid templateColumns="1fr 1fr" gap={4}>
                  <GridItem>
                    <Checkbox
                      onChange={() => handleCheckboxChange(user.id)}
                      isChecked={itensSelecionados.includes(user.id)}
                    >
                      {user.nome}
                    </Checkbox>
                  </GridItem>
                  <GridItem>
                    <Input
                      name="peso"
                      placeholder="Peso"
                      _placeholder={{ color: 'inherit' }}
                      borderColor="black"
                      focusBorderColor="black"
                      value={pesos[user.id] || ''}
                      onChange={(e) => handlePesosChange(user.id, e.target.value)}
                    />
                  </GridItem>
                </Grid>
              </ChakraProvider>
            </FormControl>
          ))}
      </Stack>
    );
  }

  const [itensCadastrados, setItensCadastrados] = useState([]);

  // const handleDeleteItem = (item) => {
  //   let itemDelete = itensCadastrados.indexOf(item, 0)
  // }

  useEffect(() => {
    console.log(itensCadastrados);
  }, [itensCadastrados]);

  const handleCadastrarItem = () => {
    // Acessar os dados selecionados dos checkboxes
    const itensSelecionadosData = usuariosGrupo.filter((user) =>
      itensSelecionados.includes(user.id)
    );

    // Acessar os pesos dos usuários selecionados
    const usuariosSelecionados = itensSelecionadosData.map((item) => item.nome);
    const pesosSelecionados = itensSelecionadosData.map((item) => pesos[item.id]);

    // Converter as listas de usuários e pesos em strings
    const usuariosString = usuariosSelecionados.join(",");
    const pesosString = pesosSelecionados.join(",");

    // Criar um novo objeto de item cadastrado com os valores atuais
    const novoItemCadastrado = {
      descricao: nomeItem,
      preco_unitario: custo,
      quantidade: quantidade,
      usuarios: usuariosString,
      pesos: pesosString,
    };

    // Adicionar o novo item à lista de itens cadastrados
    setItensCadastrados((prevItensCadastrados) => [
      ...prevItensCadastrados,
      novoItemCadastrado,
    ]);

    // Limpar os campos de entrada após o cadastro
    setNomeItem('');
    setCusto(0);
    setQuantidade(0);

    console.log(itensCadastrados)
    handleButtonClick();
  };

  // Teste de inputs

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


              {mostrarItem &&
                (
                  <div>
                    <FormLabel>Itens</FormLabel>
                    <div style={{ marginTop: 2 }}>
                      {itensCadastrados.length === 0 ? <p></p> : (
                        itensCadastrados.map((item, key) => (


                          <div>
                            <Grid templateColumns="1fr 1fr" gap={4}>
                              <GridItem >
                                <Text fontSize='lg'>
                                  {item.descricao}
                                </Text>
                              </GridItem>
                              <GridItem display="flex" justifyContent="flex-end">
                                <Icon
                                  as={MdOutlineModeEditOutline}
                                  color='black'
                                  w={5}
                                  h={5}
                                  mr={2}
                                />
                                <Icon
                                  as={MdDelete}
                                  color='red.500'
                                  w={5}
                                  h={5}
                                />
                              </GridItem>
                            </Grid>
                            <div>
                              <Text fontSize='lg' display="flex" justifyContent="flex-end">
                                R$ {item.preco_unitario} X {item.quantidade}  = R$ {parseFloat(parseFloat(item.preco_unitario) * parseFloat(item.quantidade))}
                              </Text>
                            </div>
                          </div>

                        ))
                      )}
                    </div>
                    <Button
                      style={{ background: '#6F9951' }}
                      mr={3}
                      onClick={handleButtonClick}
                    > Novo Item </Button>
                  </div>
                )}

              {mostrarDiv && (
                <div>
                  <FormLabel>Itens</FormLabel>
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
                    <CheckboxList usuariosGrupo={usuariosSelecionados} />
                  </div>
                  <br></br>
                  <Flex justifyContent="flex-start">
                    <Button marginRight="0.5rem" onClick={handleCadastrarItem}>Cadastrar Item</Button>
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