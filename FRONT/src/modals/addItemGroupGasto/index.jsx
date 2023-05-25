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


export default function AddItemGroupGasto({ isOpen, onClose, initialRef, finalRef, nomeGasto, groups_id, gastoId, handleCreateSuccess}) {

  const [nome, setNome] = useState('');
  const [valor, setValor] = useState(0);
  const [quantidade, setQuantidade] = useState(0);
  const [descricao, setDescricao] = useState('');
  const token = localStorage.getItem('token');

  const handleSubmit = () => {

    const data = {
        preco_unitario: valor,
        quantidade: quantidade,
        descricao: descricao,
        id_GastosGrupo_id: gastoId,
    }

    console.log(JSON.stringify(data))

    axios.post('http://localhost:8000/grupos/cadastrar-item/', data)//{
    //     headers: {
    //         'Authorization': `Bearer ${token}`
    //       }
    // })
      .then(response => {
        if (response.status === 201) { 
          onClose()
          alert('Item Cadastrado')
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
              {nomeGasto}
            </ModalHeader>

            <ModalBody>
              <FormControl mt={4}>
                <label>Item</label>
                <br></br>
                <Input onChange={(e) => {
                  setDescricao(e.target.value)
                }} />
              </FormControl>

              <FormControl mt={4}>
                <label>Preço Unitário</label>
                <br></br>
                <Input onChange={(e) => {
                  setValor(e.target.value)
                }} />
              </FormControl>
                
              <FormControl mt={4}>
                <label>Quantidade</label>
                <br></br>
                <Input 
                onChange={(e) => {
                  setQuantidade(e.target.value)
                }} />
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
