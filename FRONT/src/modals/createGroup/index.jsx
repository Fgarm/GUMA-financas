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
  Text,
} from '@chakra-ui/react'

import axios from 'axios'


export default function Groups({ isOpen, onClose, initialRef, finalRef, user }) {

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');

  const [nomeError, setNomeError] = useState('');
  const [descricaoError, setDescricaoError] = useState('');

  const handleSubmit = () => {

    const data = {
      username: user,
      nome: nome,
      descricao: descricao,
    }

    if (nome === '' || user === '') {
      alert('Preencha o campo de nome do grupo')
      return
    }

    axios.post('http://localhost:8000/grupos/cadastrar-grupo/', data)
      .then(response => {
        if (response.status === 201) {
          setNome('')
          setDescricao('')
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
            Criando Novo Grupo
          </ModalHeader>

          <ModalBody>
            <FormControl mt={4}>
              <label>Nome</label>
              <br></br>
              <Input
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.trim().length > 0) {
                    setNome(value);
                    setNomeError(null);
                  } else {
                    setNome('');
                    setNomeError('Este campo é obrigatório.');
                  }
                }}
              />
              {nomeError && (
                <Text color="red" fontSize="sm">{nomeError}</Text>
              )}
            </FormControl>

            <FormControl mt={4}>
              <label >Descrição</label>
              <br></br>
              <Textarea
                placeholder='Sobre oque é o grupo?'
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.trim().length > 0) {
                    setDescricao(value);
                    setDescricaoError(null);
                  } else {
                    setDescricao('');
                    setDescricaoError('Este campo é obrigatório.');
                  }
                }}
              />
              {descricaoError && (
                <Text color="red" fontSize="sm">{descricaoError}</Text>
              )}
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              style={{ backgroundColor: '#6F9951' }}
              mr={3}
              onClick={() => {
                let hasEmptyFields = false;

                if (nome.trim().length === 0) {
                  setNomeError('Este campo é obrigatório.');
                  hasEmptyFields = true;
                } else {
                  setNomeError(null);
                }

                if (descricao.trim().length === 0) {
                  setDescricaoError('Este campo é obrigatório.');
                  hasEmptyFields = true;
                } else {
                  setDescricaoError(null);
                }

                if (!hasEmptyFields) {
                  handleSubmit();
                }
              }}
            >
              Criar
            </Button>
            <Button onClick={() => {
              onClose();
              setNomeError(null);
              setDescricaoError(null);
            }}
            >
              Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>

  );

}
