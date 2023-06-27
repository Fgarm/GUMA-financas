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
  Checkbox,
  Select,
  useToast,
  Text,
} from '@chakra-ui/react'

import axios from 'axios'


export default function AddSaldo({ isOpen, onClose, initialRef, finalRef, user, addFlag }) {
  
  const toast = useToast();

  const [nome, setNome] = useState('');
  const [valor, setValor] = useState('');
  const [data, setData] = useState('');

  const [hasPeridiocity, setHasPeridiocity] = useState(false);
  const [periodicity, setPeriodicity] = useState('');

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


    const dados_periodicos = {
      frequencia: periodicity,
      user: user,
      data: data,
      nome,
      tipo: 'entrada',
      pago: null,
      valor,
      // tag: tag_submit.categoria,
    };

    
    if(hasPeridiocity == false){
      console.log(JSON.stringify(datas))
      axios.post("http://localhost:8000/bancario/add-saldo/", datas)
        .then((response) => {
          console.log(response)
          if(response.status === 200){
            setNome('')
            setValor(0)
            addFlag()
            setHasPeridiocity(false)
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
    } else {
      console.log(JSON.stringify(dados_periodicos))
      axios.post('http://127.0.0.1:8000/recorrencia/criar-recorrencias/', dados_periodicos)
        .then(response => {
          if (response.status == 200 || response.status == 201) {
            console.log('Dados enviados com sucesso:', response.data);
            toast({
              title: 'Entrada recorrente inserida com sucesso.',
              status: 'success',
              isClosable: true,
              duration: 3000,
            })
          } else {
            setHasPeridiocity(false)
            alert('Erro de dados submetidos')
            return
          }
          onClose();
          setHasPeridiocity(false)
          addFlag()        
        }).catch((error) => {
          console.log(error)
        })
      }
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
                  const value = e.target.value;
                  setNome(value);
                  // if (value.trim().length > 0) {
                  //   setNome(value);
                  //   setNomeError(null);
                  // } else {
                  //   setNome('');
                  //   setNomeError('Este campo é obrigatório.');
                  // }
                }}
              />
              {/* {nomeError && (
                <Text color="red" fontSize="sm">{nomeError}</Text>
              )} */}
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

              <FormControl mt={4}>
                  <Checkbox className='checkbox-peridiocity'
                    onChange={(e) => setHasPeridiocity(e.target.checked)}>
                      A entrada é periódica?
                  </Checkbox>
                </FormControl>

                {hasPeridiocity ? (
                  <FormControl mt={4}>
                    <label >Peridiocidade</label>
                    <br></br>
                    <Select
                      placeholder="Selecione uma opção"
                      onChange={(e) => {
                        if (e.target.value == 'diario') {
                          setPeriodicity('Diario')
                        } else if (e.target.value == 'semanal') {
                          setPeriodicity('Semanal')
                        } else if (e.target.value == 'mensal') {
                          setPeriodicity('Mensal')
                        } else if (e.target.value == 'anual') {
                          setPeriodicity('Anual') 
                        }
                      }}>
                      <option value='diario'>Diário</option>
                      <option value='semanal'>Semanal</option>
                      <option value='mensal'>Mensal</option>
                      <option value='anual'>Anual</option>
                    </Select>
                  </FormControl>
                ) : (
                  <></>
                  )}

              {/* <FormControl mt={4}>
                <label>Data</label>
                <br></br>
                <Input
                  type='date'
                  onChange={(e) => {
                    setData(e.target.value)
                  }}
                />
              </FormControl> */}
            <FormControl mt={4}>
              <label>Valor</label>
              <br></br>
              <Input
                    value={`R$ ${valor.toLocaleString('pt-BR', {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    }) || ''}`}
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/\D/g, '');
                      const floatValue = parseFloat(rawValue) / 100;

                      if (rawValue.length > 0) {
                        setValor(floatValue);
                        setValorError('');
                      } else {
                        setValor(0)
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

                // if (nome.trim().length === 0) {
                //   setNomeError('Este campo é obrigatório.');
                //   hasEmptyFields = true;
                // } else {
                //   setNomeError(null);
                // }

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
                setHasPeridiocity(false)
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
