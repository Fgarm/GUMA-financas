import React, { useState } from 'react';

import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalFooter,
    ModalBody,
    FormControl,
    Input,
    Textarea,
    Button,
    useDisclosure,
    ModalHeader,
  } from '@chakra-ui/react'
  
  import axios from 'axios'


export default function Groups({ isOpen, onClose, initialRef, finalRef, user }) {

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');

  const handleSubmit = () => {

    const data = {
      username: user,
      nome: nome,
      descricao: descricao,
    }

    axios.post('http://localhost:8000/grupos/cadastrar-grupo/', data)
      .then(response => {
        if (response.status === 201) { 
          onClose()
        } else if (response.status === 409) {
          alert('Grupo de nome já cadastrado no sistema')
        } else if (response.status === 400) {
          alert('Dados de cadastro não estão nos parâmetros aceitos')
        } else {
          alert('Erro de solicitação')
        }
      })
      .catch(error => {
        console.log(data);
        console.log("Erro de solicitação-ERROR");
        console.log(error);
      });
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
              Criando Grupo
            </ModalHeader>

            <ModalBody>
              <FormControl mt={4}>
                <label>Nome</label>
                <br></br>
                <Input onChange={(e) => {
                  setNome(e.target.value)
                }} />
              </FormControl>

              <FormControl mt={4}>
                <label >Descrição</label>
                <br></br>
                <Textarea 
                placeholder='Sobre oque é o grupo?' 
                onChange={(e) => {
                    setDescricao(e.target.value)
                }}
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button 
                colorScheme='blue' 
                mr={3} 
                onClick={handleSubmit}>
                Criar
              </Button>
              <Button onClick={onClose}>Cancelar</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
  
    );
    
}
