import React, { useState, useEffect, useRef } from 'react'
import { MdOutlineModeEditOutline, MdDelete } from 'react-icons/md'

import PeopleInput from '../../components/peopleInput'
import {
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
  useToast
} from '@chakra-ui/react'

import axios from 'axios'

import './style.css'

export default function CreateGastoGroup({ isOpen, onClose, initialRef, finalRef, groups_id, handleCreateSuccess, userClicked, usuariosGastos }) {

  const grupoId = localStorage.getItem('grupo_id')
  const token = localStorage.getItem('token')

  const [mostrarItem, setmostrarItem] = useState(true)
  const [mostrarDiv, setMostrarDiv] = useState(false)

  const [nomeGasto, setNomeGasto] = useState('')
  const [usuariosGasto, setUsuariosGasto] = useState([])
  const [custo, setCusto] = useState(0)
  const [nomeItem, setNomeItem] = useState('')
  const [quantidade, setQuantidade] = useState('')

  const [nomeGastoError, setNomeGastoError] = useState('')
  const [usuariosGastoError, setUsuariosGastoError] = useState('')
  const [custoError, setCustoError] = useState('')
  const [nomeItemError, setNomeItemError] = useState('')
  const [quantidadeError, setQuantidadeError] = useState('')

  const [usuariosGrupo, setUsuariosGrupo] = useState([{ username: 'teste' }])
  const [usuariosSelecionados, setUsuariosSelecionados] = useState([])

  const [pesos, setPesos] = useState({})
  const [keyItem, setKeyItem] = useState(0)
  const [itensCadastrados, setItensCadastrados] = useState([])
  const [itensSelecionados, setItensSelecionados] = useState([])

  // const [pesosDefault, setPesosDefault] = useState([])
  // const [usuariosDefault, setUsuariosDefault] = useState([])

  const cancelRef = React.useRef()
  const { isOpen: isAlertDialogOpen, onClose: onAlertDialogClose, onOpen: onAlertDialogOpen } = useDisclosure()

  const toast = useToast()

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

    if (usuariosGasto.length == '') {
      toast({
        title: 'Selecione os usuários do gasto',
        status: 'error',
        isClosable: true,
        duration: 3000,
      })
      return
    }

    const data = {
      nome_gasto: nomeGasto,
      id_grupo_id: groups_id,
      usuarios: usuariosGasto,
      itens: itensCadastrados
    }

    console.log(JSON.stringify(data))

    axios.post('http://localhost:8000/grupos/cadastrar-gastos-itens/', data)
      .then(response => {
        if (response.status === 201) {
          toast({
            title: 'Gasto do grupo criado com sucesso',
            status: 'success',
            isClosable: true,
            duration: 3000,
          })
        }

        // if (response.status === 409) {
        //   toast({
        //     title: 'Grupo de nome já cadastrado no sistema',
        //     status: 'error',
        //     isClosable: true,
        //     duration: 3000,
        //   })
        // } else if (response.status === 400) {
        //   toast({
        //     title: 'Dados de cadastro não estão nos parâmetros aceitos',
        //     status: 'error',
        //     isClosable: true,
        //     duration: 3000,
        //   })

        // } else {
        //   toast({
        //     title: 'Erro de solicitação',
        //     status: 'error',
        //     isClosable: true,
        //     duration: 3000,
        //   })
        // }

      })
      .catch(error => {
        console.log(error)
      })


    onClose()
    handleCreateSuccess()
    handleCloseModal()
  }

  function handleButtonClick() {
    setPesos({})
    setItensSelecionados([])
    setMostrarDiv(!mostrarDiv)
    setmostrarItem(!mostrarItem)
  }

  function handleCheckboxChange(id) {
    setItensSelecionados((selecionados) => {
      if (selecionados.includes(id)) {
        return selecionados.filter((item) => item !== id)
      } else {
        return [...selecionados, id]
      }
    })
  }

  useEffect(() => {
  }, [itensCadastrados])

  function handleCadastrarItem() {

    // Acessar os dados selecionados dos checkboxes
    const itensSelecionadosData = usuariosGrupo.filter((user) =>
      itensSelecionados.includes(user.id)
    )

    // Acessar os pesos dos usuários selecionados
    const usuariosSelecionados = itensSelecionadosData.map((item) => item.username)
    const pesosSelecionados = itensSelecionadosData.map((item) => pesos[item.id])

    const hasNaNPesos = pesosSelecionados.some((pesos) => isNaN(parseFloat(pesos)))

    if (hasNaNPesos) {
      toast({
        title: 'Existem pesos inválidos',
        status: 'error',
        isClosable: true,
        duration: 3000,
      })
      return
    }

    // Verificar a soma dos pesos
    const somaPesos = pesosSelecionados.reduce((accumulator, currentValue) => {
      const parsedValue = parseFloat(currentValue)
      if (isNaN(parsedValue) || parsedValue < 0) {
        toast({
          title: 'Pesos não podem ter valor negativo',
          status: 'error',
          isClosable: true,
          duration: 3000,
        })
        return
      }
      return accumulator + parsedValue
    }, 0)


    console.log(`PESOS: ${somaPesos}`)
    if (somaPesos != 100) {
      toast({
        title: 'A soma dos pesos deve ser igual 100',
        status: 'error',
        isClosable: true,
        duration: 3000,
      })
      return
    }

    // Converter as listas de usuários e pesos em strings
    const usuariosString = usuariosSelecionados.join(",")
    const pesosString = pesosSelecionados.join(",")


    // Criar um novo objeto de item cadastrado com os valores atuais
    const novoItemCadastrado = {
      descricao: nomeItem,
      preco_unitario: parseFloat(custo),
      quantidade: parseFloat(quantidade),
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

  function handleClearInput() {
    setNomeItem('')
    setCusto(0)
    setQuantidade('')
  }

  function handleDeleteClick(data) {
    setKeyItem(data)
    onAlertDialogOpen()
  }

  function handleExcluirItem() {
    setItensCadastrados((prevItensCadastrados) =>
      prevItensCadastrados.filter((item, i) => i !== keyItem)
    )
    onAlertDialogClose()
  }

  function handleEditarClick(data) {
    const itemEncontrado = itensCadastrados.find((item, i) => i === data)

    setNomeItem(itemEncontrado.descricao)
    setCusto(itemEncontrado.preco_unitario)
    setQuantidade(itemEncontrado.quantidade)

    const { usuarios, pesos } = itemEncontrado

    const novoItensCadastrados = itensCadastrados.filter((item, index) => index !== data)

    console.log("itensCadastrados atualizados:", novoItensCadastrados)
    console.log("Usuários:", usuarios)
    console.log("Pesos:", pesos)

    setItensCadastrados((prevItensCadastrados) =>
      prevItensCadastrados.filter((item) => item !== itemEncontrado)
    )

    console.log("itensCadastrados atualizados:", itensCadastrados)

    handleButtonClick()
  }

  function handleCloseModal() {
    onClose()
    setMostrarDiv(false)
    setmostrarItem(true)
    setItensCadastrados([]) // Limpa a lista de itens cadastrados
    handleClearInput()
    setItensSelecionados([])
    setPesos({})
  }

  return (


    <div>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
        closeOnOverlayClick={false}
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
              <Input
                _placeholder={{ color: 'inherit' }}
                borderColor="black"
                focusBorderColor="black"
                onChange={(e) => {
                  const value = e.target.value
                  if (value.trim().length > 0) {
                    setNomeGasto(value)
                    setNomeGastoError('')
                  } else {
                    setNomeGasto('')
                    setNomeGastoError('Este campo é obrigatório.')
                  }
                }} />
              {nomeGastoError && (
                <Text color="red" fontSize="sm">{nomeGastoError}</Text>
              )}

            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Usuários</FormLabel>
              <PeopleInput onUsuariosChange={handleUsuariosChange} usuarios={usuariosGrupo} />
            </FormControl>

            <FormControl mt={4}>
              {mostrarItem &&
                (
                  <div>
                    <FormLabel as='b' fontSize='lg'>Itens</FormLabel>
                    <div className='itens'>
                      {itensCadastrados.length === 0 ? (
                        <p></p>
                      ) : (
                        itensCadastrados.map((item, key) => (

                          <div key={key} style={{ marginTop: '30px' }}>
                            <div>
                              <Grid templateColumns="1fr 1fr" gap={4}>
                                <GridItem display="flex" justifyContent="flex-start">
                                  <Text as='b' fontSize='lg'>
                                    {item.descricao}
                                  </Text>
                                </GridItem>
                                <GridItem display="flex" justifyContent="flex-end">

                                  {/* <Icon
                                    as={MdOutlineModeEditOutline}
                                    w={5}
                                    h={5}
                                    onClick={() => handleEditarClick(key)}
                                  /> */}

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
                                <Text fontSize='lg' display="flex" justifyContent="flex-end" color='black'>
                                  Total = {parseFloat(item.preco_unitario).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} X {item.quantidade} = {(parseFloat(item.preco_unitario) * parseFloat(item.quantidade)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </Text>
                                {item.usuarios.map((usuario, index) => (
                                  <div key={index}>
                                    <Text fontSize='lg' display="flex" justifyContent="flex-end" color='black'>
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
                    <Input
                      placeholder='Nome do item'
                      _placeholder={{ color: 'inherit' }}
                      borderColor="black"
                      focusBorderColor="black"
                      defaultValue={nomeItem}
                      onChange={(e) => {
                        const value = e.target.value
                        if (value.trim().length > 0) {
                          setNomeItem(value)
                          setNomeItemError('')
                        } else {
                          setNomeItem('')
                          setNomeItemError('Este campo é obrigatório.')
                        }
                      }} />
                    {nomeItemError && (
                      <Text color="red" fontSize="sm">{nomeItemError}</Text>
                    )}
                  </FormControl>
                  <br></br>
                  <FormControl>
                    <ChakraProvider>
                      <Grid templateColumns="1fr 1fr" gap={4}>
                        <GridItem>
                          <Input
                            placeholder="Custo"
                            _placeholder={{ color: 'inherit' }}
                            borderColor="black"
                            focusBorderColor="black"
                            value={`R$ ${custo.toLocaleString('pt-BR', {
                              maximumFractionDigits: 2,
                              minimumFractionDigits: 2,
                            }) || ''}`}
                            onChange={(e) => {
                              const rawValue = e.target.value.replace(/\D/g, '');
                              const floatValue = parseFloat(rawValue) / 100;

                              if (rawValue.length > 0) {
                                setCusto(floatValue);
                                setCustoError('');
                              } else {
                                setCusto(0)
                                setCustoError('Este campo é obrigatório.');
                              }
                            }}
                          />

                          {custoError && (
                            <Text color="red" fontSize="sm">{custoError}</Text>
                          )}
                        </GridItem>
                        <GridItem>
                          <Input
                            placeholder="Quantidade"
                            _placeholder={{ color: 'inherit' }}
                            borderColor="black"
                            focusBorderColor="black"
                            defaultValue={quantidade}
                            onChange={(e) => {
                              const value = e.target.value
                              if (value.trim().length > 0) {
                                setQuantidade(value)
                                setQuantidadeError('')
                              } else {
                                setQuantidade('')
                                setQuantidadeError('Este campo é obrigatório.')
                              }
                            }} />
                          {quantidadeError && (
                            <Text color="red" fontSize="sm">{quantidadeError}</Text>
                          )}
                        </GridItem>
                      </Grid>
                    </ChakraProvider>
                  </FormControl>
                  <br></br>
                  <FormLabel>Participantes e consumo</FormLabel>
                  <div>
                    <Stack spacing={2}>
                      {usuariosSelecionados &&
                        usuariosSelecionados.map((user) => (
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
                                    step="1"
                                    placeholder="Peso"
                                    _placeholder={{ color: 'inherit' }}
                                    borderColor="black"
                                    focusBorderColor="black"
                                    value={`${pesos[user.id] || ''}%`}
                                    onChange={(e) => {
                                      setPesos((prevPesos) => ({
                                        ...prevPesos,
                                        [user.id]: e.target.value.replace('%', ''),
                                      }))
                                    }}
                                  />
                                </GridItem>
                              </Grid>
                            </ChakraProvider>
                          </FormControl>
                        ))}
                    </Stack>
                    {/* <CheckboxList usuariosGrupo={} /> */}
                  </div>
                  <br></br>
                  <Flex justifyContent="flex-start">
                    <Button marginRight="0.5rem"
                      onClick={() => {
                        let hasEmptyFields = false

                        if (nomeItem.trim().length === 0) {
                          setNomeItemError('Este campo é obrigatório.')
                          hasEmptyFields = true
                        } else {
                          setNomeItemError('')
                        }

                        if (custo.length === 0 || custo == '') {
                          setCustoError('Este campo é obrigatório.')
                          hasEmptyFields = true
                        } else {
                          setCustoError('')
                        }

                        if (quantidade.trim().length === 0) {
                          setQuantidadeError('Este campo é obrigatório.')
                          hasEmptyFields = true
                        } else {
                          setQuantidadeError('')
                        }

                        if (!hasEmptyFields) {
                          handleCadastrarItem()
                        }
                      }}


                    >Cadastrar Item</Button>
                    <Button
                      marginRight="0.5rem"
                      onClick={() => {
                        setNomeItemError('')
                        setCustoError('')
                        setQuantidadeError('')
                        handleClearInput()
                        handleButtonClick()
                      }}>Cancelar</Button>
                  </Flex>

                </div>
              )}

            </FormControl>

          </ModalBody>

          <ModalFooter>

            <Button
              style={{ background: '#6F9951' }}
              mr={3}
              onClick={() => {
                let hasEmptyFields = false

                if (nomeGasto.trim().length === 0) {
                  setNomeGastoError('Este campo é obrigatório.')
                  hasEmptyFields = true
                } else {
                  setNomeGastoError('')
                }

                if (!hasEmptyFields) {
                  handleSubmit()
                }
              }}>
              Criar
            </Button>
            <Button onClick={() => {
              setNomeGastoError('')
              setNomeItemError('')
              setCustoError('')
              setQuantidadeError('')
              handleCloseModal()
            }
            }>Cancelar</Button>

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




