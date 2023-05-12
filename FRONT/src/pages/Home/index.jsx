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
  // const [category, setCategory] = useState([])
  const [gastos, setGastos] = useState([])

  const [createdTag, setCreatedTag] = useState('')

  const [shouldRunEffect, setShouldRunEffect] = useState(false)

  const [searchOption, setSearchOption] = useState('');
  const [searchValue, setSearchValue] = useState(null)

  const { isOpen: isAlertDialogOpen, onClose: onAlertDialogClose, onOpen: onAlertDialogOpen } = useDisclosure();
  const { isOpen: isModalCreateOpen, onClose: onModalCreateClose, onOpen: onModalCreateOpen } = useDisclosure();
  const { isOpen: isModalEditOpen, onClose: onModalEditClose, onOpen: onModalEditOpen } = useDisclosure();
  const { isOpen: isModalTagOpen, onClose: onModalTagClose, onOpen: onModalTagOpen } = useDisclosure();

  const initialRef = React.useRef(null)
  const finalRef = React.useRef(null)
  const cancelRef = React.useRef()

  const username = localStorage.getItem('cadastro_user')
  const token = localStorage.getItem('token')

  window.addEventListener("beforeunload", function (event) {
    const perfTiming = performance.getEntriesByType("navigation")[0];
    if (perfTiming.type === "reload") {
      localStorage.setItem("token", token);
      localStorage.setItem("cadastro_user", username);
      sessionStorage.setItem("reloading", "true");
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("cadastro_user");
    }
  });

  function handleTagsChange(newTags) {
    setTags(newTags[0]);
  }

  function formatarData(data) {
    const partesData = data.split('-');
    const dia = partesData[2];
    const mes = partesData[1];
    const ano = partesData[0];
    return `${dia}/${mes}/${ano}`;
  }

  const handleSubmit = () => {
    const dados = {
      nome,
      valor,
      data,
      pago,
      tag: tags.categoria,
      user: username
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
    axios({
      method: "post",
      url: "http://localhost:8000/api/gastos/obter-gasto/",
      data: {
        user: username
      },
    })

      .then((response) => {
        const data = response.data;
        console.log(data)
        setGastos(data);
        setShouldRunEffect(true)
      })
      .catch(error => {
        console.log(error);
      })
  }

  // const getTags = () => {
  //   axios({
  //     method: "post",
  //     url: "http://localhost:8000/tags/tag-per-user/",
  //     data: {
  //       user: username
  //     },
  //   })
  //     .then((response) => {
  //       console.log(JSON.stringify(response.data))
  //       setCategory(data);
  //       setShouldRunEffect(true)
  //     })
  //     .catch(error => {
  //       console.log(error);
  //     })
  // }

  const handleLogOut = () => {
    localStorage.removeItem('cadastro_user')
    localStorage.removeItem('token')
    navigate('/');
  }

  const handleCreateClick = (data) => {
    // getTags();
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
    if (searchOption == 'status' && searchValue == false || searchOption == 'status' && searchValue == true) {
      axios({
        method: "post",
        url: "http://localhost:8000/api/gastos/filtrar-por-pago/",
        data: {
          user: username,
          pago: searchValue
        },
      })
        .then((response) => {
          console.log(response.data)
          if (response.status == 200) {
            const data = response.data;
            setGastos(data);
          }
        })
        .catch(error => {
          console.log(error);
        })
    } else if (searchOption == 'tags') {
      axios({
        method: "post",
        url: "http://localhost:8000/api/gastos/gastos-per-tag/",
        data: {
          user: username,
          tag: searchValue
        },
      })
        .then((response) => {
          if (response.statusCode == 200) {
            const data = response.data;
            setGastos(data);
          }
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

  function handleCreateTag() {

    const categoria = createdTag
    const cor = 'dad8d8'
    const user = localStorage.getItem('cadastro_user')
    const newTag = { categoria, cor, user }
    const tag = newTag
    axios.post('http://localhost:8000/tags/criar-tag/', tag, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        console.log()
        if (response.status == 201) {
          console.log('Dados enviados com sucesso:', response.dados);
          setCreatedTag('')
          onModalTagClose()
          setFlag(flag => flag + 1);
        } else if (response.status == 400){
          alert("Tag já existente")
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
            <div key={gasto.id} className="gasto_information">
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
                R$ {gasto.valor}
              </h2>
              <h2>
                {formatarData(gasto.data)}
              </h2>
              <h2>
              </h2>
              {gasto.pago > 0 ? <h2 style={{ color: 'darkgreen', fontWeight: 'bold'}}>Pago</h2> : <h2 style={{ color: 'red',  fontWeight: 'bold'}}>Não Pago</h2>}

            </div>
          ))

        )}
      </div>

    </div>
  )
}
