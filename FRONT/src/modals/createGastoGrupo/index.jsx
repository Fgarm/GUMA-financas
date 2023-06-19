import React, { useState, useEffect } from 'react'
import { MdOutlineModeEditOutline, MdDelete } from 'react-icons/md'
// import AddItemGroupGasto from '../../modals/addItemGroupGasto'
import CurrencyInput from 'react-currency-input-field';
import PeopleInput from '../../components/peopleInput'
import {
  Alert,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
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

  const grupoId = localStorage.getItem('grupo_id')
  const token = localStorage.getItem('token')

  const [mostrarItem, setmostrarItem] = useState(true)
  const [mostrarDiv, setMostrarDiv] = useState(false)

  const [nomeGasto, setNomeGasto] = useState('')
  const [custo, setCusto] = useState('')
  const [usuariosGasto, setUsuariosGasto] = useState([])
  const [nomeItem, setNomeItem] = useState('')
  const [quantidade, setQuantidade] = useState(0)
  const [usuariosGrupo, setUsuariosGrupo] = useState([{ username: 'teste' }])
  const [usuariosSelecionados, setUsuariosSelecionados] = useState([])

  const [pesos, setPesos] = useState({})
  const [keyItem, setKeyItem] = useState(0)
  const [itensCadastrados, setItensCadastrados] = useState([])
  const [itensSelecionados, setItensSelecionados] = useState([])


  const cancelRef = React.useRef()
  const { isOpen: isAlertDialogOpen, onClose: onAlertDialogClose, onOpen: onAlertDialogOpen } = useDisclosure();

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
    }
    ).catch(error => {
      console.log(error)
    })
  }

  function handleUsuariosChange(username, name) {
    setUsuariosGasto(username)
    setUsuariosSelecionados(name)
  }

  function handleSubmit() {

    const data = {
      nome_gasto: nomeGasto,
      id_grupo_id: groups_id,
      usuarios: usuariosGasto,
      itens: itensCadastrados
    }

    console.log(JSON.stringify(data))

    // axios.post('http://localhost:8000/grupos/cadastrar-gasto-grupo/', data)
    //   .then(response => {
    //     if (response.status === 200) {
    onClose()
    handleCreateSuccess()
    handleCloseModal()
    //     } else if (response.status === 409) {
    //       alert('Grupo de nome já cadastrado no sistema')
    //     } else if (response.status === 400) {
    //       alert('Dados de cadastro não estão nos parâmetros aceitos')
    //     } else {
    //       alert('Erro de solicitação')
    //     }
    //   })
    //   .catch(error => {
    //     console.log(error)
    //   })
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
        setUsuariosGasto(response.data)
        console.log(grupoId)
        console.log(usuariosGasto)
        setShouldRunEffect(true)
      })
      .catch(error => {
        console.log(error)
      })

  }

  function handleButtonClick() {
    setPesos({})
    setItensSelecionados([])
    setMostrarDiv(!mostrarDiv)
    setmostrarItem(!mostrarItem)
  }

  // Teste de inputs

  const handleCheckboxChange = (id) => {
    setItensSelecionados((selecionados) => {
      if (selecionados.includes(id)) {
        return selecionados.filter((item) => item !== id)
      } else {
        return [...selecionados, id]
      }
    })
  }

  const handlePesosChange = (userId, value) => {
    // Removendo o símbolo de porcentagem antes de salvar no estado
    const newValue = value.replace('%', '')

    setPesos((prevPesos) => ({
      ...prevPesos,
      [userId]: newValue,
    }))
  }

  const formatValue = (value) => {
    // Adicionando o símbolo de porcentagem ao valor formatado
    return value ? `${value}%` : value
  }

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
                      value={formatValue(pesos[user.id] || '')}
                      onChange={(e) => handlePesosChange(user.id, e.target.value)}
                    />
                  </GridItem>
                </Grid>
              </ChakraProvider>
            </FormControl>
          ))}
      </Stack>
    )
  }

  useEffect(() => {
    // console.log(itensCadastrados)
  }, [itensCadastrados])

  const handleCadastrarItem = () => {
    // Acessar os dados selecionados dos checkboxes
    const itensSelecionadosData = usuariosGrupo.filter((user) =>
      itensSelecionados.includes(user.id)
    )

    // Acessar os pesos dos usuários selecionados
    const usuariosSelecionados = itensSelecionadosData.map((item) => item.username)
    const pesosSelecionados = itensSelecionadosData.map((item) => pesos[item.id])

    // Converter as listas de usuários e pesos em strings
    const usuariosString = usuariosSelecionados.join(",")
    const pesosString = pesosSelecionados.join(",")

    // Criar um novo objeto de item cadastrado com os valores atuais
    const novoItemCadastrado = {
      descricao: nomeItem,
      preco_unitario: custo,
      quantidade: quantidade,
      // usuarios: usuariosString,
      // pesos: pesosString,
      usuarios: usuariosSelecionados,
      pesos: pesosSelecionados,
    }

    // Adicionar o novo item à lista de itens cadastrados
    setItensCadastrados((prevItensCadastrados) => [
      ...prevItensCadastrados,
      novoItemCadastrado,
    ])

    // Limpar os campos de entrada após o cadastro
    handleClearInput()

    console.log(itensCadastrados)
    handleButtonClick()
  }

  const handleClearInput = () => {
    // Limpar os campos de entrada após o cadastro
    setNomeItem('')
    setCusto(0)
    setQuantidade(0)
  }

  const handleDeleteClick = (data) => {
    setKeyItem(data);
    onAlertDialogOpen();
  }

  const handleExcluirItem = () => {
    setItensCadastrados((prevItensCadastrados) =>
      prevItensCadastrados.filter((item, i) => i !== keyItem)
    )
    onAlertDialogClose()
  }

  function handleCloseModal() {
    onClose()
    setMostrarDiv(false)
    setmostrarItem(true)
    setItensCadastrados([]) // Limpa a lista de itens cadastrados
    setNomeItem('')
    setCusto(0)
    setQuantidade(0)
    setItensSelecionados([])
    setPesos({})
  }

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
                setNomeGasto(e.target.value)
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
                    <div className='itens'>
                      {itensCadastrados.length === 0 ? (
                        <p></p>
                      ) : (
                        itensCadastrados.map((item, key) => (

                          <div key={key}>
                            <div>
                              <Grid templateColumns="1fr 1fr" gap={4}>
                                <GridItem display="flex" justifyContent="flex-start">
                                  <Text as='b' fontSize='lg'>
                                    {item.descricao}
                                  </Text>
                                </GridItem>
                                <GridItem display="flex" justifyContent="flex-end">

                                  <Icon
                                    as={MdDelete}
                                    color='red.500'
                                    w={5}
                                    h={5}
                                    onClick={() => handleDeleteClick(key)}
                                  />
                                </GridItem>
                              </Grid>
                              <div>
                                <Text fontSize='lg' display="flex" justifyContent="flex-end">
                                  Total = {parseFloat(item.preco_unitario).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} X {item.quantidade} = {(parseFloat(item.preco_unitario) * parseFloat(item.quantidade)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </Text>
                                {item.usuarios.map((usuario, index) => (
                                  <div key={index}>
                                    <Text fontSize='lg' display="flex" justifyContent="flex-end">
                                      {usuario} : {item.pesos[index]} % = {(((parseFloat(item.preco_unitario) * parseFloat(item.quantidade)) / 100) * parseFloat(item.pesos[index])).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </Text>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <Button
                      style={{ background: '#6F9951' }}
                      mr={3}
                      onClick={handleButtonClick}
                    >
                      Novo Item
                    </Button>

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
                  </FormControl>
                  <br></br>
                  <FormControl>
                    <ChakraProvider>
                      <Grid templateColumns="1fr 1fr" gap={4}>
                        <GridItem>
                          <Input onChange={(e) => {
                            setCusto(e.target.value)
                          }}
                            placeholder="Custo"
                            _placeholder={{ color: 'inherit' }}
                            borderColor="black"
                            focusBorderColor="black"
                          />
                        </GridItem>
                        <GridItem>
                          <Input onChange={(e) => {
                            setQuantidade(e.target.value)
                          }}
                            placeholder="Quantidade"
                            _placeholder={{ color: 'inherit' }}
                            borderColor="black"
                            focusBorderColor="black"
                          />
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
            <Button onClick={handleCloseModal}>Cancelar</Button>

          </ModalFooter>

        </ModalContent>
      </Modal>

      <div>
        <AlertDialog
          isOpen={isAlertDialogOpen}
          leastDestructiveRef={cancelRef}
          onClose={onAlertDialogClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader
                fontSize='lg'
                fontWeight='bold'>
                Deletar Item
              </AlertDialogHeader>

              <AlertDialogBody>
                Deseja realmente deletar esse item?
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onAlertDialogClose}>
                  Cancelar
                </Button>

                <Button colorScheme='red' ml={3} onClick={handleExcluirItem}>
                  Deletar
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </div>

    </div>

  )
}

