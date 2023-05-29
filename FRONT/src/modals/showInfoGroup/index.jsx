import React, { useState } from 'react';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Icon,
  Grid, 
  FormControl,
  Input,
  Textarea,
  Button,
  useDisclosure,
  ModalHeader,
} from '@chakra-ui/react'

import { LuUsers } from "react-icons/lu";

import axios from 'axios'


export default function ShowInfoGroup({ isOpen, onClose, user, itensGasto, usuariosGastos, gasto_id }) {

  // const [usuariosGasto, setUsuariosGasto] = useState('')
  // const [itensGasto, setItensGasto] = useState('')
  const [modalContent, setModalContent] = useState('names');

  function getPesosItens() {
    axios({
        method: "post",
        url: "http://localhost:8000/grupos/itens-gastos/",
        data: {
            gasto_id: gastoId,
        },
    }).then(response => {
        setItensGasto(response.data)
        console.log(response.data)
    }
    ).catch(error => {
        console.log(error)
    })
  }
  
  const renderContent = () => {
    if (modalContent === 'names') {
      return usuariosGastos.map((user) =>
      <li key={user.id}>{user.id} {user.nome}</li>);
    } else if (modalContent === 'ages') {
      return itensGasto.map((item) => <li key={item.descricao}>{item.preco_total}</li>);
    } else if (modalContent === 'pesos') {
      return itensGasto.map((item) => <li key={item.usuario}>{user.peso}</li>);
    }
    return null;
  };

  const handleButtonClick = (content) => {
    setModalContent(content);
  };

  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Informações do Grupo</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ul>{renderContent()}</ul>
          </ModalBody>

          <ModalFooter>
            {/* <Icon
              as={LuUsers}
              w={5}
              h={5}
              mr={2}
              onClick={() => handleButtonClick('names')} colorScheme={modalContent === 'names' ? 'blue' : 'gray'} /> */}
            <Grid templateColumns="repeat(4, 1fr)" columnGap={4} alignItems="center">
              <Button onClick={() => handleButtonClick('names')} colorScheme={modalContent === 'names' ? 'blue' : 'gray'}>
              Usuarios
            </Button>
            <Button onClick={() => handleButtonClick('ages')} colorScheme={modalContent === 'ages' ? 'blue' : 'gray'}>
              Itens
            </Button>
            <Button onClick={() => handleButtonClick('pesos')} colorScheme={modalContent === 'pesos' ? 'blue' : 'gray'}>
              Pesos
            </Button>
            <Button colorScheme='red' mr={3} onClick={onClose}>
              Close
            </Button>
            </Grid>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>

  );

}
