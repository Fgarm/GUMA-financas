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
  const [tags, setTags] = useState();

  const [gastos, setGastos] = useState([])

  const [shouldRunEffect, setShouldRunEffect] = useState(false)

  const [searchOption, setSearchOption] = useState('');
  const [searchValue, setSearchValue] = useState(null)

  const { isOpen: isAlertDialogOpen, onClose: onAlertDialogClose, onOpen: onAlertDialogOpen } = useDisclosure();
  const { isOpen: isModalCreateOpen, onClose: onModalCreateClose, onOpen: onModalCreateOpen } = useDisclosure();
  const { isOpen: isModalEditOpen, onClose: onModalEditClose, onOpen: onModalEditOpen } = useDisclosure();
  
  const initialRef = React.useRef(null)
  const finalRef = React.useRef(null)
  const cancelRef = React.useRef()
  
  const username = localStorage.getItem('cadastro_user')
  const token = localStorage.getItem('token')

  
  function handleTagsChange(newTags) {
    setTags(newTags);
  }
  
  const handleSubmit = () => {
    const dados = {
      username,
      nome,
      valor,
      data,
      pago,
    };
    
    axios.post('http://localhost:8000/api/gastos/criar-gasto/', dados, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })    
      .then(response => {
        if(response.status == 201){
          console.log('Dados enviados com sucesso:', response.dados);
        } else{
          alert('Erro de dados submetidos')
          return
        }
        onModalCreateClose();
        setFlag(flag => flag + 1);
      })
      .catch(error => {
        console.error('Erro ao enviar dados:', error);
      });

      // /* TAGS */
      // axios.post('http://localhost:8000/api/tags/criar-tag/', tags, {
      //   headers: {
      //     'Authorization': `Bearer ${token}`
      //   }
      // })    
      //   .then(response => {
      //     if(response.status == 201){
      //       console.log('Dados enviados com sucesso:', response.dados);
      //       onModalCreateClose();
      //       setFlag(flag => flag + 1);
      //     } else if(response.status == 400){
      //       alert("Valores inválidos")
      //     }
      //   })
      //   .catch(error => {
      //     console.error('Erro ao enviar dados:', error);
      //   });
  }

  const handleEdit = () => {
    const dados = {
      id,
      nome,
      valor,
      data,
      pago,
      tags
    };

    console.log(dados)

    axios.put("http://localhost:8000/api/gastos/atualizar-gasto/", {
        id: id,
        nome: nome,
        valor: valor,
        data: data,
        pago: pago
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        if(response.status == 204){
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
    axios.get("http://localhost:8000/api/gastos/meus-gastos")
      .then((response) => {
        const data = response.data;
        setGastos(data);
        setShouldRunEffect(true)
      })
      .catch(error => {
        console.log(error);
      })
  }

  const handleLogOut = () => {
    localStorage.removeItem('cadastro_user')
    navigate('/');
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
    //axios.get("http://localhost:8000/api/gastos/meusgastos?type=searchGastos&value=searchValue")
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


  return (

    <div >
      <header className='home'>
        <div className='presentation'>
          <Icon as={BiLogOut} w={7} h={7} color="red.500" onClick={handleLogOut} />
          <h2>Olá, {username}</h2>
        </div>
        <div className="bt-sb">
          <SearchBar setValueSearch={handleSearch} setSearchType={handleSearchType} />
          <Button pr='10px'>Adicionar Tags</Button>
          <Button pr='10px' onClick={onModalCreateOpen}>Adicionar Gasto</Button>
        </div>
      </header>

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
                <label >Tipo</label>
                <br></br>
                <TagsInput onTagsChange={handleTagsChange} user={username}/>
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
                <label>Tipo</label>
                <br></br>
                <TagsInput onTagsChange={handleTagsChange} user={username}/>
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
              {gasto.pago > 0 ? <h2>Pago</h2> : <h2>Não Pago</h2>}

            </div>
          ))

        )}
      </div>

    </div>
  )
}
