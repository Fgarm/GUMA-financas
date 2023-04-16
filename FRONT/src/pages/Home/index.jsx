import React, { useState, useEffect } from 'react';
import './style.css';

import SearchBar from '../../components/searchBar';
import TagsInput from '../../components/tagInput';

import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl, 
  Input,
  Button,
  useDisclosure,
  ModalHeader,
  Stack,
  Select,
  StackDivider,
  Text
} from '@chakra-ui/react'

import axios from 'axios';

export default function Home(){

  // const [tags, setTags] = useState([]);
  //const[posts, setPosts] = useState([])

  const [nome, setNome] = useState('')
  const [valor, setValor] = useState(0);
  const [data, setSelectedDate] = useState('');
  const [pago, setPago] = useState(false)

  const { isOpen, onClose, onOpen } = useDisclosure();
  const initialRef = React.useRef(null)
  const finalRef = React.useRef(null)

  const handleSubmit = () => {
    const dados = {
      nome,
      valor,
      data,
      pago
    };
    console.log(JSON.stringify(data));
    axios.post('http://localhost:8000/api/gastos/', data)

      .then(response => {
        console.log('Dados enviados com sucesso:', response.data);
        onClose(); 
    })
    .catch(error => {
      console.error('Erro ao enviar dados:', error);
    });
}

  return (
  
  <div >
    <header>
      <h3>Olá, username</h3>
        <div className="bt-sb">
          <SearchBar onChange={(e) => {
            setSearchInput(e.target.value);
          }}/>
          <Button pr='10px' onClick={onOpen}>Adicionar Gasto</Button>
        </div>
      </header>

      <div>
        <Modal
          initialFocusRef={initialRef}
          finalFocusRef={finalRef}
          isOpen={isOpen}
          onClose={onClose}
        >
          <ModalOverlay/>
          <ModalContent>
            <ModalHeader mb={0}>Criando Gasto</ModalHeader>
            <ModalCloseButton />
            <ModalBody>

            <FormControl mt={4}>
                <label >Nome</label>
                <br></br>
                <Input onChange={(e) => {
                  setNome(e.target.value)         
                }}/>
              </FormControl>

              <FormControl mt={4}>
                <label >Valor</label>
                <br></br>
                <Input onChange={(e) => {
                  setValor(e.target.value)
                 
                }}/>
              </FormControl>

              <FormControl mt={4}>
                <label >Data</label>
                <br></br>
                <Input type="date" onChange={(e) => 
                  setSelectedDate(e.target.value)
                }/>
              </FormControl>

              <FormControl mt={4}>
                <label>Status</label>
                <br></br>
                <Select placeholder='Selecione uma opção' onChange={(e) => {
                    if(e.target.value == 'pago'){
                      setPago(true)
                    } else if(e.target.value == 'nao-pago'){
                      setPago(false)
                    }
                }}>
                  <option value='pago'>Pago</option>
                  <option value='nao-pago'>Não Pago</option>
                </Select>
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={handleSubmit}>
                Criar
              </Button>
              <Button onClick={onClose}>Cancelar</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    

  </div>

  )
  
}



{/* {posts.length === 0 ? <p>Carregando...</p> : (
  posts.map((post) => (

    <div className="post" key={post.id}>
      <Card>
        <CardHeader>
          <Heading size='md'>{post.id}</Heading>
        </CardHeader>

        <CardBody>
          <Stack divider={<StackDivider />} spacing='4'>
            <Box>
              <Heading size='xs' textTransform='uppercase'>
              {post.title}
              </Heading>
              <Text pt='2' fontSize='sm'>
              {post.body}
              </Text>
            </Box>
          </Stack>
        </CardBody>

      </Card>
    </div>
  ))
)} */}


// const getPosts = async() => {
//   try {

//     const response = await Axios.get("https://jsonplaceholder.typicode.com/posts");
//     const data = response.data;
//     setPosts(data);
//   } catch (error) {
//     console.log(error);
//   }
// }

// useEffect(() => {
//   getPosts();
// }, []);
