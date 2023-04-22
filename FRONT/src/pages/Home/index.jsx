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

  const [nome, setNome] = useState('')
  const [valor, setValor] = useState(0);
  const [data, setSelectedDate] = useState('');
  const [pago, setPago] = useState(false)
  //const [tags, setTags] = useState([]);
  const [gastos, setGastos] = useState([])
  const [filteredGastos, setFilteredGastos] = useState([])

  const [searchOption, setSearchOption] = useState('');
  const [searchValue, setSearchValue] = useState('')

  const { isOpen: isAlertDialogOpen, onClose: onAlertDialogClose, onOpen: onAlertDialogOpen } = useDisclosure();
  const { isOpen: isModalOpen, onClose: onModalClose, onOpen: onModalOpen } = useDisclosure();

  const initialRef = React.useRef(null)
  const finalRef = React.useRef(null)
  const cancelRef = React.useRef()
  
  const user = localStorage.getItem('cadastro_user')
  const token = localStorage.getItem('ctoken')

  function handleTagsChange(tags) {
    setTags(tags);
  }

  const handleSubmit = () => {
    const dados = {
      nome,
      valor,
      data,
      pago,
      //tags
    };

    axios.post('http://localhost:8000/api/gastos/criar-gasto/', dados)

      .then(response => {
        console.log('Dados enviados com sucesso:', response.dados);
        onModalClose();
      })
      .catch(error => {
        console.error('Erro ao enviar dados:', error);
      });
  }

  const handleLogOut = () => {
    localStorage.removeItem('cadastro_user')
    navigate('/');
  }

  const getGastos = async () => {
    try {
      //axios.get("http://localhost:8000/api/gastos/meusgastos")
      const response = await axios.get("https://jsonplaceholder.typicode.com/posts");
      const data = response.data;
      setGastos(data);
      setFilteredGastos(data)
    } catch (error) {
      console.log(error);
    }
  }
  
  useEffect(() => {
    getGastos();
  }, []);

  // useEffect(() => {
  //   const response = axios.get("https://jsonplaceholder.typicode.com/posts/1");
  //   const filtered = response.data;
  //   setFilteredGastos(filtered);
  // }, [searchValue]);

  function handleSearchType(type){
    console.log(type)
    setSearchOption(type)
  }

  function handleSearch(data){
    console.log(data)
    setSearchValue(data)
  }


  return (


    <div >
      <header className='home'>
        <div className='presentation'>
          <Icon as={BiLogOut} w={7} h={7} color="red.500" onClick={handleLogOut} />
          <h2>Olá, {user}</h2>
        </div>
        <div className="bt-sb">
          <SearchBar setValueSearch={handleSearch} setSearchType={handleSearchType}/>
          <Button pr='10px' onClick={onModalOpen}>Adicionar Gasto</Button>
        </div>
      </header>

      <div>
        <Modal
          initialFocusRef={initialRef}
          finalFocusRef={finalRef}
          isOpen={isModalOpen}
          onClose={onModalClose}
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
                <TagsInput onTagsChange={handleTagsChange} />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={handleSubmit}>
                Criar
              </Button>
              <Button onClick={onModalClose}>Cancelar</Button>
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
                Apagar Gasto
              </AlertDialogHeader>

              <AlertDialogBody>
                Tem certeza? Esta ação não pode ser desfeita.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onAlertDialogClose}>
                  Cancel
                </Button>
                <Button colorScheme='red' onClick={onAlertDialogClose} ml={3}>
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </div>

      <div className="post">
        {filteredGastos.length === 0 ? <p>Carregando...</p> : (
          filteredGastos.map((post) => (
            <div className="post_information" key={post.id}>
              <div className='header'>
                <h1>
                  {post.id}
                </h1>
                <div>
                  <Icon as={MdOutlineModeEditOutline} w={5} h={5} mr={2} onClick={onModalOpen} />
                  <Icon as={MdDelete} color='red.500' w={5} h={5} onClick={onAlertDialogOpen} />
                </div>
              </div>
              <h2>
                {post.title}
              </h2>
              <h2>
                {post.body}
              </h2>
            </div>
          ))

        )}
      </div>

    </div>

  )

}






