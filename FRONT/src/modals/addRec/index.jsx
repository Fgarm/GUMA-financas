import React, { useState, useEffect } from 'react';
import TagsInput from '../../components/tagInput'
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
    Select, 
    Tabs, 
    TabList, 
    TabPanels, 
    Tab, 
    TabPanel
} from '@chakra-ui/react'

import axios from 'axios'

export default function AddRec({ isOpen, onClose, initialRef, finalRef, user, addFlag}) {
  
    const [nome, setNome] = useState('Entrada');
    const [valor, setValor] = useState('');

    const [pago, setPago] = useState(null);
    const [date, setSelectedDate] = useState('');

    const [tab, setTab] = useState(0)

    const username = localStorage.getItem('cadastro_user')

    const [tags, setTags] = useState([])
    const [tagsList, setTagsList] = useState({})

    const [periodicity, setPeriodicity] = useState('');

    function handleTab(index){
        setTab(index)
        console.log(index)
    }

    function handleTagsChange(newTag) {
        setTagsList(newTag);
    }

    useEffect(() => {
        getTags()
    }, [])

    const getTags = () => {
        axios({
         method: "post",
        url: "http://localhost:8000/tags/tag-per-user/",
        data: {
            user: username
        },
        })
        .then((response) => {
            setTags(response.data);
            console.log(tags)
        })
        .catch(error => {
            console.log(error);
        })
    }

    const handleSubmit = () => {

    let n = parseFloat(valor)

    if(valor === ''|| n < 0){
        alert('Preencha todos os campos corretamente')
        return
    }
    
    const dados_periodicos_gastos = {
        frequencia: periodicity,
        user: user,
        data: date,
        nome,
        tipo: 'gasto',
        pago: pago,
        valor,
        tag: tagsList.categoria,
      };


    const dados_periodicos_entrada = {
      frequencia: periodicity,
      user: user,
      data: date,
      nome,
      tipo: 'entrada',
      pago: null,
      valor,
      // tag: tag_submit.categoria,
    };
            
    if(tab === 0){
      console.log(JSON.stringify(dados_periodicos_entrada))
      axios.post('http://127.0.0.1:8000/recorrencia/criar-recorrencias/', dados_periodicos_entrada)
        .then(response => {
          if (response.status == 200 || response.status == 201) {
            console.log('Dados enviados com sucesso:', response.data);
            addFlag()
          } else {
              alert('Erro de dados submetidos')
              return
          }
          onClose();
          addFlag()        
          }
          )
        .catch(error => {
          console.log(error)
          alert('Erro de dados submetidos')
          return
        }
        )
    } else if(tab === 1){
      console.log(JSON.stringify(dados_periodicos_gastos))
      axios.post('http://127.0.0.1:8000/recorrencia/criar-recorrencias/', dados_periodicos_gastos)
        .then(response => {
          if (response.status == 200 || response.status == 201) {
            console.log('Dados enviados com sucesso:', response.data);
            addFlag()
          } else {
              alert('Erro de dados submetidos')
              return
          }
          onClose();
          addFlag()
          }
          )
        .catch(error => {
          console.log(error)
          alert('Erro de dados submetidos') 
          return
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
                Adicionar Recorrência
            </ModalHeader>

            <ModalBody>
            <Tabs variant='enclosed'>
                <TabList>
                    <Tab onClick={() => handleTab(0)}>Entrada</Tab>
                    <Tab onClick={() => handleTab(1)}>Gasto</Tab>
                    </TabList>
                <TabPanels>
                    <TabPanel>
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
                    setSelectedDate(e.target.value)
                    }}
                />
              </FormControl>

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

                    </TabPanel>
                    <TabPanel>
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
                    setValor(e.target.value);
                  }} />
                </FormControl>

                <FormControl mt={4}>
                  <label >Data</label>
                  <br></br>
                  <Input 
                    type="date"
                    onChange={(e) =>
                    setSelectedDate(e.target.value)
                  } />
                </FormControl>

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
               
                <FormControl mt={4}>
                  <label>Status</label>
                  <br></br>
                  <Select 
                    placeholder="Selecione uma opção"
                  onChange={(e) => {
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
                  <label >Tags</label>
                  <br></br>
                  <TagsInput
                    tags={tags} 
                    onTagsChange={handleTagsChange} 
                    user={username} />
                </FormControl>

                    </TabPanel>
                </TabPanels>
            </Tabs>
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
