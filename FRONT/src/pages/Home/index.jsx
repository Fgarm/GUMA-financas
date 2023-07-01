import React, { useState, useEffect } from 'react';
import './style.css';
import '../../main.css';

import { MdOutlineModeEditOutline, MdDelete } from 'react-icons/md';
// import { BiLogOut } from "react-icons/bi";

// import { BsTag, BsTagFill, BsTags, BsFillTagsFill, BsCurrencyDollar } from "react-icons/bs";
import { BsFillTagsFill, BsCurrencyDollar } from "react-icons/bs";
import { GiCash } from "react-icons/gi"

import { useNavigate } from 'react-router-dom';

import TagsInput from '../../components/tagInput';
import Sidebar from '../../components/sidebar';
import ToggleSearchStatus from '../../components/toggleSearchStatus';

import AddSaldo from '../../modals/addSald';
import CreateTag from '../../modals/createTag';
import CreateGastoUser from '../../modals/createGastoUser';

import formatarData from '../../functions/formatData';
import compareDate from '../../functions/compareDate';
import usaFormat from '../../functions/usaFormat';

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
  background,
  Checkbox,
  CheckboxGroup,
  Text,
  Tooltip,
  useToast
} from '@chakra-ui/react'

import axios from 'axios';

export default function Home() {

  const navigate = useNavigate()
  const toast = useToast()

  const [flag, setFlag] = useState(0)

  const [id, setId] = useState('')
  const [nomeError, setNomeError] = useState('')
  const [valorError, setValorError] = useState('')
  const [dataError, setDataError] = useState('')

  const [hasPeridiocity, setHasPeridiocity] = useState(false)
  const [periodicity, setPeriodicity] = useState('')

  const [nome, setNome] = useState('')
  const [valor, setValor] = useState(0)
  const [data, setSelectedDate] = useState('')
  const [pago, setPago] = useState(false)
  const [tagsList, setTagsList] = useState({})

  const [tags, setTags] = useState([])


  const [gastos, setGastos] = useState([])
  const [gastosEntrada, setGastosEntrada] = useState([])
  const [editStatus, setEditStatus] = useState(false)
  const [editTags, setEditTags] = useState('')

  const [gastosEntradasPorData, setGastosEntradasPorData] = useState({});
  const [gastosPorDataFiltrados, setGastosPorDataFiltrados] = useState({});

  const [createdTag, setCreatedTag] = useState('')
  const [tagColor, setTagColor] = useState('')

  const [saldo, setSaldo] = useState(0)

  const [shouldRunEffect, setShouldRunEffect] = useState(false)

  const [searchOption, setSearchOption] = useState('');
  const [searchValue, setSearchValue] = useState(null)
  const [isFilterOn, setIsFilterOn] = useState(false)

  const [novaTag, setNovaTag] = useState(0)

  const { isOpen: isAlertDialogOpen, onClose: onAlertDialogClose, onOpen: onAlertDialogOpen } = useDisclosure();
  const { isOpen: isModalCreateGastoOpen, onClose: onModalCreateGastoClose, onOpen: onModalCreateGastoOpen } = useDisclosure();
  const { isOpen: isModalEditOpen, onClose: onModalEditClose, onOpen: onModalEditOpen } = useDisclosure();
  const { isOpen: isModalTagOpen, onClose: onModalTagClose, onOpen: onModalTagOpen } = useDisclosure();
  const { isOpen: isAddSaldoOpen, onClose: onAddSaldoClose, onOpen: onAddSaldoOpen } = useDisclosure();

  const initialRef = React.useRef(null)
  const finalRef = React.useRef(null)
  const cancelRef = React.useRef()

  const username = localStorage.getItem('cadastro_user')
  const token = localStorage.getItem('token')

  function handleTagsChange(newTag) {
    setTagsList(newTag);
  }



  function handleAddSaldo() {
    getTags()
    onAddSaldoOpen()
  }

  function handleCreateTag() {
    getTags()
    onModalTagOpen()
  }

  function handleCreateGasto() {
    getTags()
    onModalCreateGastoOpen()
  }


  function handleClearInput() {
    setNome('');
    setValor(0);
    setPago(false);
    setSelectedDate('');
  }

  function handleClearErros() {
    setNomeError('');
    setValorError('');
    setDataError('');
  }

  function handleCloseModalCreate() {
    setHasPeridiocity(false)
    onModalCreateClose()
  }

  function handleCloseCreateTag(){
    onModalTagClose()
  }

  function implementRecurrency() {
    console.log('implementando recorrencias')

    const dado = {
      user: username
    }

    console.log(dado)

    axios.post('http://127.0.0.1:8000/recorrencia/implementar-recorrencias/', dado)
      .then(response => {
        console.log(response.data)
      })
      .catch(error => {
        console.log(error)
      })
  }

  function extrairData(dataHora) {
    const data = dataHora.split('T')[0];
    return formatarData(data);
  }

  function handleCloseAddSaldo() {
    onAddSaldoClose()
  }

  function handleCloseCreateGasto() {
    onModalCreateGastoClose()
  }

  function organizarGastosPorData(params) {
    let gastosData = {};
    params.forEach(gasto => {
      const data = extrairData(gasto.data);
      if (gastosData[data]) {
        gastosData[data].push(gasto);
      } else {
        gastosData[data] = [gasto];
      }
    });

    const sortedKeys = Object.keys(gastosData).sort((a, b) => new Date(b.split('/').reverse().join('/')) - new Date(a.split('/').reverse().join('/')));

    const gastosOrdenado = {};
    sortedKeys.forEach(key => {
      gastosOrdenado[key] = gastosData[key];
    });

    setGastosPorDataFiltrados(gastosOrdenado); // Atualize o estado aqui
    console.log(gastosPorDataFiltrados);

  }


  function organizarGastosEntradasPorData(params) {
    let gastosPorData = {};
    params.forEach(gasto => {
      const data = extrairData(gasto.data);
      if (gastosPorData[data]) {
        gastosPorData[data].push(gasto);
      } else {
        gastosPorData[data] = [gasto];
      }
    });

    const sortedKeys = Object.keys(gastosPorData).sort((a, b) => new Date(b.split('/').reverse().join('/')) - new Date(a.split('/').reverse().join('/')));

    const gastosPorDataOrdenado = {};
    sortedKeys.forEach(key => {
      gastosPorDataOrdenado[key] = gastosPorData[key];
    });

    setGastosEntradasPorData(gastosPorDataOrdenado);
    // console.log(gastosEntradasPorData);
  }

  function addFlag() {
    console.log('add flag')
    setFlag(flag => flag + 1);
  }

  function getGastosEntrada() {
    axios.post("http://localhost:8000/bancario/extrato-saldo/", {
      username: username
    })
      .then(response => {
        setGastosEntrada(response.data)
        organizarGastosEntradasPorData(response.data)
        // setGastosEntradasPorData(gastosPorData); 
      })
      .catch(error => {
        console.log("user", username)
        console.error('Erro ao enviar dados:', error);
      }
      )
  }

  function getSaldos() {
    axios.post("http://localhost:8000/bancario/saldo-atual/", {
      username: username
    })
      .then(response => {
        setSaldo(response.data)
      })
      .catch(error => {
        console.error('Erro ao enviar dados:', error);
      }
      )
  }


  const handleEdit = () => {
    const tag_edit = tagsList;

    if (valor < 0) {
      setValor(valor * -1)
    }

    axios.put("http://localhost:8000/api/gastos/atualizar-gasto/", {
      user: username,
      id: id,
      nome: nome,
      valor: valor,
      data: data,
      pago: pago,
      tag: tag_edit.categoria
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        if (response.status == 204) {
          console.log('Gasto atualizado com sucesso');
          onModalEditClose();
          handleClearInput()
          setFlag(flag => flag + 1);
        } else {
          alert("Erro ao atualizar gasto")
        }
      })
      .catch(error => {
        console.error('Erro ao enviar dados:', error);
      });
  }

  const handleDelete = () => {
    console.log(id)
    axios.delete(`http://localhost:8000/api/gastos/deletar-gasto/`, {
      data: { id: id },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        toast({
          title: 'Gasto deletado com sucesso',
          status: 'success',
          isClosable: true,
          duration: 3000,
        });
        onAlertDialogClose();
        setFlag(flag => flag + 1);
      })
      .catch(error => {
        console.error('Erro ao enviar dados:', error);
      });
  }

  const getGastos = () => {
    axios({
      method: "post",
      url: "http://localhost:8000/api/gastos/obter-gasto/",
      data: {
        user: username
      },
    })
      .then((response) => {
        const data = response.data;
        setGastos(data);
        organizarGastosPorData(data);
        setShouldRunEffect(true)
        console.log(response.data)
      })
      .catch(error => {
        console.log(error);
      })
  }

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
        setShouldRunEffect(true)
      })
      .catch(error => {
        console.log(error);
      })
  }

  const handleLogOut = () => {
    localStorage.removeItem('cadastro_user')
    localStorage.removeItem('token')
    // navigate('/');
  }

  const handleDeleteClick = (data) => {
    setId(data);
    onAlertDialogOpen();
  }

  const handleEditClick = (data) => {
    getTags()
    tagsList.categoria = data.tag
    setId(data.id);
    setNome(data.nome)
    setValor(data.valor * -1)
    setSelectedDate(usaFormat(data.data))
    console.log("DIA", data)
    setEditTags(data.tag)
    if (data.pago == true) {
      setEditStatus('pago')
      setPago(true)
    } else if (data.pago == false) {
      setEditStatus('nao-pago')
      setPago(false)
    }
    onModalEditOpen();
  }

  useEffect(() => {
    implementRecurrency();
    getGastos();
    getGastosEntrada();
    getSaldos();
  }, [flag]);

  useEffect(() => {
    organizarGastosPorData(gastos);
  }, [gastos]);


  function handleSearchType(type) {
    console.log(type)
    // setSearchOption(type)
  }

  function handleSearch(data) {
    console.log(data)
    // setSearchValue(data)
  }


  return (
    <>
      <Sidebar user={username} />
      <div className="body">
        <header className='home'>
          <h1 className='page-title'>Meu Extrato</h1>
          <div className="bt-sb">
            <ToggleSearchStatus
              flag={flag}
              novaTag={novaTag}
              user={username}
              onGastosChange={setGastos}
              filterOn={setIsFilterOn}
            />
            <div className='new-tag-and-gasto-button-container'>
              
              <Button className='new-tag-and-gasto-button' onClick={handleAddSaldo}> {/*className='new-income-button'*/}
                <Icon style={{ marginLeft: '-1px', marginRight: '9px' }} as={GiCash} w={6} h={5} />
                Nova Entrada
              </Button>

              <Button
                className='new-tag-and-gasto-button'
                pr='10px'
                onClick={handleCreateGasto}>
                <Icon style={{ marginLeft: '-1px', marginRight: '9px' }} as={BsCurrencyDollar} w={6} h={5} />
                Novo Gasto
              </Button>
            
              <Button
                className='new-tag-and-gasto-button'
                pr='10px'
                onClick={handleCreateTag}>
                <Icon style={{ marginLeft: '-10px', marginRight: '10px' }} as={BsFillTagsFill} w={5} h={5} />
                Nova Tag
              </Button>
            
            </div>
          </div>
        </header>

        <div className='add-entrada'>

          <div className="saldo-information">
            R$ {saldo}
          </div>


        </div>

        <div>
          <Modal
            closeOnOverlayClick={false}
            initialFocusRef={initialRef}
            finalFocusRef={finalRef}
            isOpen={isModalEditOpen}
            onClose={onModalEditClose}
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader
                mb={0}
                className='modal_header'>
                Editando Gasto
              </ModalHeader>
              <ModalBody>

                <FormControl mt={4}>
                  <label >Nome</label>
                  <br></br>
                  <Input
                    defaultValue={nome}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.trim().length > 0) {
                        setNome(value);
                        setNomeError(null);
                      } else {
                        setNome('');
                        setNomeError('Este campo é obrigatório.');
                      }
                    }} />
                  {nomeError && (
                    <Text color="red" fontSize="sm">{nomeError}</Text>
                  )}
                </FormControl>

                <FormControl mt={4}>
                  <label >Valor</label>
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

                <FormControl mt={4}>
                  <label >Data</label>
                  <br></br>
                  <Input
                    defaultValue={data}
                    type="date"
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.trim().length > 0) {
                        setSelectedDate(value);
                        setDataError(null);
                      } else {
                        setSelectedDate('');
                        setDataError('Este campo é obrigatório.');
                      }
                    }} />
                  {dataError && (
                    <Text color="red" fontSize="sm">{dataError}</Text>
                  )}
                </FormControl>

                <FormControl mt={4}>
                  <label>Status</label>
                  <br></br>
                  <Select
                    defaultValue={editStatus}
                    placeholder='Selecione uma opção'
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
                  <label>Tags</label>
                  <br></br>
                  <TagsInput
                    tags={tags}
                    editado={editTags}
                    onTagsChange={handleTagsChange}
                    user={username}
                  />
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

                    if (data.trim().length === 0) {
                      setDataError('Este campo é obrigatório.');
                      hasEmptyFields = true;
                    } else {
                      setDataError(null);
                    }

                    if (!hasEmptyFields) {
                      handleEdit();
                    }
                  }}
                >
                  Salvar
                </Button>
                <Button onClick={() => {
                  handleClearErros()
                  onModalEditClose()
                }}>Cancelar</Button>
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
                <AlertDialogHeader
                  fontSize='lg'
                  fontWeight='bold'>
                  Deletar Gastos
                </AlertDialogHeader>

                <AlertDialogBody>
                  Deseja realmente deletar esse gasto?
                </AlertDialogBody>

                <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={onAlertDialogClose}>
                    Cancelar
                  </Button>

                  <Button colorScheme='red' ml={3} onClick={handleDelete}>
                    Deletar
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </div>

        <div>
          <AddSaldo isOpen={isAddSaldoOpen} onClose={onAddSaldoClose} user={username} addFlag={addFlag}>
            <Button onClick={handleCloseAddSaldo}>Fechar</Button>
          </AddSaldo>
        </div>

        <div>
          <CreateGastoUser isOpen={isModalCreateGastoOpen} onClose={onModalCreateGastoClose} user={username} addFlag={addFlag} tags={tags}>
            <Button onClick={handleCloseCreateGasto}>Fechar</Button>
          </CreateGastoUser>
        </div>

        <div>
          <CreateTag isOpen={isModalTagOpen} onClose={onModalTagClose} user={username} addFlag={addFlag}>
            <Button onClick={handleCloseCreateTag}>Fechar</Button>
          </CreateTag>
        </div>

        <div className="gasto">
          {isFilterOn == false ? (
            Object.entries(gastosEntradasPorData).length === 0 ? (
              <p>Não há gastos com os parâmetros especificados</p>
            ) : (
              Object.entries(gastosEntradasPorData).map(([data, gastos]) => (
                <div key={data}>
                  {compareDate(data) === true ? (
                    <h4 className="dia_gasto">Hoje</h4>
                  ) : (
                    <h3 className="dia_gasto">{data}</h3>
                  )}
                  {gastos.map((gasto, key) => (
                    <div key={gasto.id} className="gasto_information">
                      <p>{gasto.nome}</p>
                      <p>
                        {gasto.valor > 0 ? (
                          <p style={{ color: '#6F9951', fontWeight: 'bold' }}>
                            + R$ {gasto.valor}{' '}
                          </p>
                        ) : (
                          <p style={{ color: 'red', fontWeight: 'bold' }}>
                            
                            - R$ {gasto.valor * -1}{' '}
                          </p>
                        )}
                      </p>
                      <p>
                        {gasto.pago == null ? (
                          ''
                        ) : gasto.pago > 0 ? (
                          <p style={{ color: '#6F9951', fontWeight: 'bold' }}>
                            Pago
                          </p>
                        ) : (
                          <p style={{ color: 'red', fontWeight: 'bold' }}>
                            Não Pago
                          </p>
                        )}
                      </p>
                      <p>{gasto.tag}</p>
                      <div>
                        {gasto.valor < 0 && (
                          <>
                            <Icon
                              className="edit-icon-gasto"
                              as={MdOutlineModeEditOutline}
                              color="whiteAlpha.500"
                              w={5}
                              h={5}
                              mr={2}
                              onClick={() => handleEditClick(gasto)}
                            />
                            {/* <span class="tooltip-edit">Editar gasto</span> */}

                            <Icon
                              className="delete-icon-gasto"
                              as={MdDelete}
                              color="red.500"
                              w={5}
                              h={5}
                              onClick={() => handleDeleteClick(gasto.id)}
                            />
                            {/* <span class="tooltip-delete">Excliur gasto</span> */}
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))
            )
          ) : (
            Object.entries(gastosPorDataFiltrados).length === 0 ? (
              <p>Não há gastos com os parâmetros especificados</p>
            ) : (
              Object.entries(gastosPorDataFiltrados).map(([data, gastos]) => (
                <div key={data}>
                  {compareDate(data) === true ? (
                    <h4 className="dia_gasto">Hoje</h4>
                  ) : (
                    <h3 className="dia_gasto">{data}</h3>
                  )}
                  {gastos.map((gasto, key) => (
                    <div key={gasto.id} className="gasto_information">
                      <p>{gasto.nome}</p>

                      <p style={{ color: 'red', fontWeight: 'bold' }}>
                        -R$ {gasto.valor}
                      </p>

                      <p>
                        {gasto.pago == null ? (
                          ''
                        ) : gasto.pago > 0 ? (
                          <p style={{ color: 'darkgreen', fontWeight: 'bold' }}>
                            Pago
                          </p>
                        ) : (
                          <p style={{ color: 'red', fontWeight: 'bold' }}>
                            Não Pago
                          </p>
                        )}
                      </p>
                      <p>{gasto.tag}</p>
                      <div>
                        {gasto.valor < 0 && (
                          <>
                            <Icon
                              className="edit-icon-gasto"
                              as={MdOutlineModeEditOutline}
                              w={5}
                              h={5}
                              mr={2}
                              onClick={() => handleEditClick(gasto)}
                            />
                            <Icon
                              className="delete-icon-gasto"
                              as={MdDelete}
                              color="red.500"
                              w={5}
                              h={5}
                              onClick={() => handleDeleteClick(gasto.id)}
                            />
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))
            )
          )}
        </div>


      </div>
    </>
  )
}
