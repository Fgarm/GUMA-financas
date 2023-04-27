import React, { useState, useEffect } from 'react';
import './style.css';

import { MdOutlineModeEditOutline, MdDelete } from 'react-icons/md';
import { BiLogOut } from "react-icons/bi";

import { useNavigate } from 'react-router-dom';

import SearchBar from '../../components/searchBar';
import TagsInput from '../../components/tagInput';

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  FormControl,
  Input,
  Button,
  useDisclosure,
  ModalHeader,
  Select,
} from '@chakra-ui/react'

import axios from 'axios';

export default function Home() {

  const navigate = useNavigate();

  const [flag, setFlag] = useState(0)

  const [id, setId] = useState('')
  const [nome, setNome] = useState('')
  const [valor, setValor] = useState(0);
  const [data, setSelectedDate] = useState('');
  const [pago, setPago] = useState(false)
  const [tags, setTags] = useState('');
  const [category, setCategory] = useState([])

  const [gastos, setGastos] = useState([])

  const [createdTag, setCreatedTag] = useState('')

  const [shouldRunEffect, setShouldRunEffect] = useState(false)

  const [searchOption, setSearchOption] = useState('');
  const [searchValue, setSearchValue] = useState(null)

  const [valorError, setValorError] = useState(false)

  const { isOpen: isAlertDialogOpen, onClose: onAlertDialogClose, onOpen: onAlertDialogOpen } = useDisclosure();
  const { isOpen: isModalCreateOpen, onClose: onModalCreateClose, onOpen: onModalCreateOpen } = useDisclosure();
  const { isOpen: isModalEditOpen, onClose: onModalEditClose, onOpen: onModalEditOpen } = useDisclosure();
  const { isOpen: isModalTagOpen, onClose: onModalTagClose, onOpen: onModalTagOpen } = useDisclosure();

  const initialRef = React.useRef(null)
  const finalRef = React.useRef(null)
  const cancelRef = React.useRef()

  const username = localStorage.getItem('cadastro_user')
  const token = localStorage.getItem('token')

  window.addEventListener("beforeunload", function(event) {
    // Cria um objeto PerformanceNavigationTiming
    const perfTiming = performance.getEntriesByType("navigation")[0];
    // Verifica o tipo de navegação
    if (perfTiming.type === "reload") {
      // Armazena os dados de token e cadstr_user no localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("cadastro_user", username);
      // Adiciona a chave "reloading" ao sessionStorage
      sessionStorage.setItem("reloading", "true");
    } else {
      // Remove os dados de token e cadstr_user do localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("cadastro_user");
    }
  });

  // window.addEventListener("beforeunload", function(event) {
  //   // Verifica se a página está sendo recarregada
  //   if (performance.navigation.type == 1) {
  //     // Armazena os dados de token e cadstr_user no localStorage
  //     localStorage.setItem("token", token);
  //     localStorage.setItem("cadstr_user", cadstr_user);
  //     // Adiciona a chave "reloading" ao sessionStorage
  //     sessionStorage.setItem("reloading", "true");
  //   } else {
  //     // Remove os dados de token e cadstr_user do localStorage
  //     localStorage.removeItem("token");
  //     localStorage.removeItem("cadstr_user");
  //   }
  // });
  
  

  function handleTagsChange(newTags) {
    setTags(newTags[0]);
  }

  const handleSubmit = () => {
    const dados = {
      user: username,
      nome,
      valor,
      data,
      pago,
      tag: tags.categoria
    };
    console.log(JSON.stringify(dados))
    axios.post('http://localhost:8000/api/gastos/criar-gasto/', dados, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        if (response.status == 201) {
          console.log('Dados enviados com sucesso:', response.dados);
        } else {
          alert('Erro de dados submetidos')
          return
        }
        onModalCreateClose();
        setFlag(flag => flag + 1);
      })
      .catch(error => {
        console.error('Erro ao enviar dados:', error);
      });

  }

  const handleEdit = () => {
    const dados = {
      id,
      nome,
      valor,
      data,
      pago,
      tag: tags.categoria
    };

    console.log(dados)

    axios.put("http://localhost:8000/api/gastos/atualizar-gasto/", {
      user: username,
      id: id,
      nome: nome,
      valor: valor,
      data: data,
      pago: pago,
      tag: tags.categoria
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        if (response.status == 204) {
          console.log('Dados editados com sucesso:', response.dados);
          onModalEditClose();
          setFlag(flag => flag + 1);
        } else {
          alert("Erro ao atualizar gasto")
        }
      })
      .catch(error => {
        console.error('Erro ao enviar dados:', error);
      });
  }

  const handleDelete = () => {
    axios.delete(`http://localhost:8000/api/gastos/deletar-gasto/`, {
      data: { id: id },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        console.log('Gasto deletado com sucesso');
        onAlertDialogClose();
        setFlag(flag => flag + 1);
      })
      .catch(error => {
        console.error('Erro ao enviar dados:', error);
      });
  }

  const getGastos = () => {
    // const dados = {
    //   user: username,
    //   token: token,
    // }
    // console.log(JSON.stringify(token))
    axios({
      method: "post",
      url: "http://localhost:8000/api/gastos/obter-gasto/",
      data: {
        user: username
      },
    })
      // axios.get("http://localhost:8000/api/gastos/meus-gastos/")

      .then((response) => {
        const data = response.data;
        setGastos(data);
        setShouldRunEffect(true)
      })
      .catch(error => {
        console.log(error);
      })
  }

  const getTags = () => {
    axios({
      method: "post",
      url: "http://localhost:8000/tags/tag-per-user/",
      data: {
        user: username
      },
    })
      .then((response) => {
        console.log(JSON.stringify(response.data))
        setCategory(data);
        setShouldRunEffect(true)
      })
      .catch(error => {
        console.log(error);
      })
  }


  const handleLogOut = () => {
    localStorage.removeItem('cadastro_user')
    localStorage.removeItem('token')
    navigate('/');
  }
  
  const handleCreateClick = (data) => {
    getTags();
    onModalCreateOpen();
  }

  const handleDeleteClick = (data) => {
    setId(data);
    onAlertDialogOpen();
  }

  const handleEditClick = (data) => {
    setId(data);
    onModalEditOpen();
  }

  useEffect(() => {
    getGastos();
  }, [flag]);

  useEffect(() => {
    if (shouldRunEffect) {
      searchFilter();
    } else {
      setShouldRunEffect(true);
    }
  }, [searchValue, searchOption]);

  const searchFilter = () => {
    data: {}
  axios.post(`http://localhost:8000/api/gastos/meusgastos?type=${searchOption}&value=${searchValue}`)
    if (searchOption == 'status' && searchValue == false || searchOption == 'status' && searchValue == true) {
      axios.get("https://jsonplaceholder.typicode.com/posts/1")
        .then((response) => {
          const data = response.data;
          setGastos([data]);
        })
        .catch(error => {
          console.log(error);
        })
    }

  };


  function handleSearchType(type) {
    console.log(type)
    setSearchOption(type)
  }

  function handleSearch(data) {
    console.log(data)
    setSearchValue(data)
  }

  function handleCreateTag(){

    const categoria = createdTag
    const cor = 'dad8d8'
    const user = localStorage.getItem('cadastro_user')
    const newTag = {categoria, cor, user}
    const tag = newTag
    axios.post('http://localhost:8000/tags/criar-tag/', tag, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        // axios.post('http://localhost:8000/tags/criar-tag/', tags, {
        .then(response => {
          if (response.status == 201) {
            console.log('Dados enviados com sucesso:', response.dados);
            setCreatedTag('')
            onModalTagClose()
            setFlag(flag => flag + 1);
          } else if (response.status == 400) {
            alert("Valores inválidos")
          }
        })
        .catch(error => {
          console.error('Erro ao enviar dados:', error);
        });
}


  return (

    <div >
      <header className='home'>
        <div className='presentation'>
          <Icon as={BiLogOut} w={7} h={7} color="red.500" onClick={handleLogOut} />
          <h2>Olá, {username}</h2>
        </div>
        <div className="bt-sb">
          <SearchBar setValueSearch={handleSearch} setSearchType={handleSearchType} />
          <Button pr='10px' onClick={onModalTagOpen}>Adicionar Tag</Button>
          <Button pr='10px' onClick={handleCreateClick}>Adicionar Gasto</Button>
        </div>
      </header>

      <div>
        <Modal
        isOpen={isModalTagOpen}
        onClose={onModalTagClose}
        >
        <ModalOverlay />
          <ModalContent>
            <ModalHeader mb={0} className='modal_header'>Criando Tag</ModalHeader>
            <ModalBody>
              <FormControl mt={4}>
                <label>Categoria</label>
                <br></br>
                <Input onChange={(e) => {
                  setCreatedTag(e.target.value)
                }} />

              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={handleCreateTag}> 
                Criar
              </Button>
              <Button onClick={onModalTagClose}>Cancelar</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
      <div>
        <Modal
          initialFocusRef={initialRef}
          finalFocusRef={finalRef}
          isOpen={isModalCreateOpen}
          onClose={onModalCreateClose}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader mb={0} className='modal_header'>Criando Gasto</ModalHeader>
            <ModalBody>

              <FormControl mt={4}>
                <label >Nome</label>
                <br></br>
                <Input onChange={(e) => {
                  setNome(e.target.value)
                }} />
              </FormControl>

              <FormControl mt={4}>
                <label >Valor</label>
                <br></br>
                <Input onChange={(e) => {
                  setValor(e.target.value);
                }} />
              </FormControl>

              <FormControl mt={4}>
                <label >Data</label>
                <br></br>
                <Input type="date" onChange={(e) =>
                  setSelectedDate(e.target.value)
                } />
              </FormControl>

              <FormControl mt={4}>
                <label>Status</label>
                <br></br>
                <Select placeholder='Selecione uma opção' onChange={(e) => {
                  if (e.target.value == 'pago') {
                    setPago(true)
                  } else if (e.target.value == 'nao-pago') {
                    setPago(false)
                  }
                }}>
                  <option value='pago'>Pago</option>
                  <option value='nao-pago'>Não Pago</option>
                </Select>
              </FormControl>

              <FormControl mt={4}>
                <label >Tags</label>
                <br></br>
                <TagsInput onTagsChange={handleTagsChange} user={username} />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={handleSubmit}>
                Criar
              </Button>
              <Button onClick={onModalCreateClose}>Cancelar</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>

      <div>
        <Modal
          initialFocusRef={initialRef}
          finalFocusRef={finalRef}
          isOpen={isModalEditOpen}
          onClose={onModalEditClose}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader mb={0} className='modal_header'>Editando Gasto</ModalHeader>
            <ModalBody>

              <FormControl mt={4}>
                <label >Nome</label>
                <br></br>
                <Input onChange={(e) => {
                  setNome(e.target.value)
                }} />
              </FormControl>

              <FormControl mt={4}>
                <label >Valor</label>
                <br></br>
                <Input onChange={(e) => {
                  setValor(e.target.value)

                }} />
              </FormControl>

              <FormControl mt={4}>
                <label >Data</label>
                <br></br>
                <Input type="date" onChange={(e) =>
                  setSelectedDate(e.target.value)
                } />
              </FormControl>

              <FormControl mt={4}>
                <label>Status</label>
                <br></br>
                <Select placeholder='Selecione uma opção' onChange={(e) => {
                  if (e.target.value == 'pago') {
                    setPago(true)
                  } else if (e.target.value == 'nao-pago') {
                    setPago(false)
                  }
                }}>
                  <option value='pago'>Pago</option>
                  <option value='nao-pago'>Não Pago</option>
                </Select>
              </FormControl>

              <FormControl mt={4}>
                <label>Tags</label>
                <br></br>
                <TagsInput onTagsChange={handleTagsChange} user={username} />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={handleEdit}>
                Salvar
              </Button>
              <Button onClick={onModalEditClose}>Cancelar</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>

      <div>
        <AlertDialog
          isOpen={isAlertDialogOpen}
          leastDestructiveRef={cancelRef}
          onClose={onAlertDialogClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                Deletar Gastos
              </AlertDialogHeader>

              <AlertDialogBody>
                Deseja realmente deletar esse gasto?
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onAlertDialogClose}>
                  Cancelar
                </Button>

                <Button colorScheme='red' ml={3} onClick={handleDelete}>
                  Deletar
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </div>

      <div className="gasto">
        {gastos.length === 0 ? <p></p> : (
          gastos.map((gasto, key) => (
            <div className="gasto_information">
              <div className='header'>
                <h1>
                  {gasto.nome}
                </h1>
                <div>
                  <Icon as={MdOutlineModeEditOutline} w={5} h={5} mr={2} onClick={() => handleEditClick(gasto.id)} />
                  <Icon as={MdDelete} color='red.500' w={5} h={5} onClick={() => handleDeleteClick(gasto.id)} />
                </div>
              </div>
              <h2>
                {gasto.valor}
              </h2>
              <h2>
                {gasto.data}
              </h2>
              <h2>
              </h2>
              {gasto.pago > 0 ? <h2>Pago</h2> : <h2>Não Pago</h2>}
              {gasto.tag}

            </div>
          ))

        )}
      </div>

    </div>
  )
}
