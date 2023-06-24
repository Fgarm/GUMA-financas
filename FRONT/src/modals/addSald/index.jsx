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
    Select
  } from '@chakra-ui/react'
  
import axios from 'axios'


export default function AddSaldo({ isOpen, onClose, initialRef, finalRef, user, addFlag}) {
  
  const [nome, setNome] = useState('');
  const [valor, setValor] = useState('');

  const [hasPeridiocity, setHasPeridiocity] = useState(false);
  const [periodicity, setPeriodicity] = useState('');

  const handleSubmit = () => {

    let n = parseFloat(valor)

    if(valor === ''|| n < 0){
        alert('Preencha todos os campos corretamente')
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
      data: new Date().split('T')[0],
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
            addFlag()
            onClose()
          }
        }
      ).catch((error) => {
        console.log(error)
      })  
    } else {
      console.log(JSON.stringify(dados_periodicos))
      axios.post('http://127.0.0.1:8000/recorrencia/criar-recorrencias/', dados_periodicos)
        .then(response => {
          if (response.status ==! 400) {
            console.log('Dados enviados com sucesso:', response.data);
          } else {
            alert('Erro de dados submetidos')
            return
          }
          onModalCreateClose();
          addFlag()        
        }
        )
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
