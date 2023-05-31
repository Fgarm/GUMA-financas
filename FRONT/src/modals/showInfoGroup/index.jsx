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
  Button,
  useDisclosure,
  List,
  ListItem,
  ListIcon,
  OrderedList,
  UnorderedList,
  ModalHeader,
} from '@chakra-ui/react'

import { LuUsers } from "react-icons/lu";

import axios from 'axios'


export default function ShowInfoGroup({ isOpen, onClose, user, itensGasto, usuariosGastos, gasto_id }) {

  // const [usuariosGasto, setUsuariosGasto] = useState('')
  // const [itensGasto, setItensGasto] = useState('')
  const [modalContent, setModalContent] = useState('names');

  // function getPesos() {
  //   if (gastoId !== '') {
  //     axios({
  //       method: "post",
  //       url: "http://localhost:8000/grupos/peso-user-item/",
  //       data: {
  //         gasto_id: gastoId,
  //       },
  //     }).then(response => {
  //       console.log("ITENS GASTO:")
  //       console.log(response.data)
  //       setItensGasto(response.data)
  //     }
  //     ).catch(error => {
  //       console.log(error)
  //     })
  //   }
  // }

  const renderContent = () => {
    if (modalContent === 'names') {
      return usuariosGastos.map((user) =>
        <UnorderedList>
          <ListItem>{user.nome}</ListItem>
        </UnorderedList>
      );
    } else if (modalContent === 'ages') {

      return itensGasto.map((item) =>
        <UnorderedList>
          <ListItem>{item.quantidade} X {item.descricao} : R${item.preco_total}</ListItem>
        </UnorderedList>);
    } 
    // else if (modalContent === 'pesos') {
    //   return itensGasto.map((item) => <li key={item.usuario}>{user.peso}</li>);
    // }
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
          <ModalHeader className='modal_header'>Informações do Grupo</ModalHeader>
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
            <Grid templateColumns="repeat(3, 1fr)" columnGap={4} alignItems="center">
              <Button onClick={() => handleButtonClick('names')} colorScheme={modalContent === 'names' ? 'blue' : 'gray'}>
                Usuarios
              </Button>
              <Button onClick={() => handleButtonClick('ages')} colorScheme={modalContent === 'ages' ? 'blue' : 'gray'}>
                Itens
              </Button>
              {/* <Button onClick={() => handleButtonClick('pesos')} colorScheme={modalContent === 'pesos' ? 'blue' : 'gray'}>
                Pesos
              </Button> */}
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
