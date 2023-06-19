import React, { useState, useEffect } from 'react';
// import TagsInput from '../../components/tagInput'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalFooter,
    ModalBody,
    FormControl,
    Input,
    Button,
    ModalHeader,
  } from '@chakra-ui/react'
  
import axios from 'axios'


export default function AddSaldo({ isOpen, onClose, initialRef, finalRef, user, tags}) {
  
  const [nome, setNome] = useState('');
  const [valor, setValor] = useState('');
  const [data, setData] = useState('');
  const [tag, setTag] = useState('');

  console.log(tags)

  const handleSubmit = () => {

    let n = parseFloat(valor)

    if(nome === '' || valor === ''|| n < 0){
        alert('Preencha todos os campos corretamente')
        return
    }
    
    const datas = {
      nome: nome,
      valor: valor,
      data: data,
      pago: true,
      tag: '',
      user: user,
    }
    
    console.log(JSON.stringify(datas))

    axios.post('http://localhost:8000/api/gastos/criar-gasto/', datas)//{
      .then(response => {
        if(response.status === 201){
          axios.post("http://localhost:8000/bancario/add-saldo/", {
                username: user,
                saldo: valor
              })
              .then(response => {
                console.log('Saldo adicionado com sucesso:', response.data);
              }
              )
          onClose();
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
                Adicionar Entrada
            </ModalHeader>

            <ModalBody>
              <FormControl mt={4}>
                <label>Nome</label>
                <br></br>
                <Input 
                  defaultValue={'Entrada'}
                  onChange={(e) => {
                    setNome(e.target.value)
                  }} />
              </FormControl>

              <FormControl mt={4}>
                <label>Valor</label>
                <br></br>
                <Input
                    onChange={(e) => {
                    setValor(e.target.value)
                    }}
                />
              </FormControl>

              <FormControl mt={4}>
                <label>Data</label>
                <br></br>
                <Input
                  type='date'
                  onChange={(e) => {
                    setData(e.target.value)
                  }}
                />
              </FormControl>

              {/* <FormControl mt={4}>
                  <label >Tags</label>
                  <br></br>
                  <TagsInput
                    tags={tags} 
                    onTagsChange={handleTagsChange} 
                    user={user} />
                </FormControl> */}
            </ModalBody>

            <ModalFooter>
              <Button 
                style={{background: '#6F9951'}} 
                mr={3} 
                onClick={handleSubmit}>
                Adicionar
              </Button>
              <Button onClick={onClose}>Cancelar</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
  
    );
}
