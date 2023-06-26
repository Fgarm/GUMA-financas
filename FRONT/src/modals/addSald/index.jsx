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
  useToast,
  Text,
} from '@chakra-ui/react'

import axios from 'axios'


export default function AddSaldo({ isOpen, onClose, initialRef, finalRef, user, addFlag }) {
  const toast = useToast();

  const [nome, setNome] = useState('');
  const [valor, setValor] = useState('');

  const [nomeError, setNomeError] = useState('');
  const [valorError, setValorError] = useState('');
  const handleSubmit = () => {

    let n = parseFloat(valor)

    if (valor === '' || n < 0) {
      toast({
        title: 'Preencha todos os campos corretamente',
        status: 'error',
        isClosable: true,
        duration: 3000,
      })
      // alert('Preencha todos os campos corretamente')
      return
    }

    const datas = {
      nome: nome,
      saldo: valor,
      username: user,
    }

    console.log(JSON.stringify(datas))
    axios.post("http://localhost:8000/bancario/add-saldo/", datas)
      .then((response) => {
        console.log(response)
        if (response.status === 200) {
          setNome('')
          setValor(0)
          addFlag()
          onClose()
          toast({
            title: 'Entrada inserida com sucesso.',
            status: 'success',
            isClosable: true,
            duration: 3000,
          })
        }
      }
      ).catch((error) => {
        console.log(error)
      })
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
                // defaultValue={'Entrada'}
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
              <label>Valor</label>
              <br></br>
              <Input
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.trim().length > 0) {
                    setValor(value);
                    setValorError(null);
                  } else {
                    setValor(0);
                    setValorError('Este campo é obrigatório.');
                  }
                }}
              />
              {valorError && (
                <Text color="red" fontSize="sm">{valorError}</Text>
              )}
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              style={{ background: '#6F9951' }}
              mr={3}
              onClick={() => {
                let hasEmptyFields = false;

                if (nome.trim().length === 0) {
                  setNomeError('Este campo é obrigatório.');
                  hasEmptyFields = true;
                } else {
                  setNomeError(null);
                }

                if (valor == 0) {
                  setValorError('Este campo é obrigatório.');
                  hasEmptyFields = true;
                } else {
                  setValorError(null);
                }

                if (!hasEmptyFields) {
                  handleSubmit();
                }
              }}>
              Adicionar
            </Button>
            <Button
              onClick={() => {
                onClose();
                setNomeError(null);
                setValorError(null);
              }}
            >
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>

  );
}
