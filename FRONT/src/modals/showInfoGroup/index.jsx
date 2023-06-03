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


import axios from 'axios'


export default function ShowInfoGroup({ isOpen, onClose, user, itensGasto, usuariosGastos, gasto_id }) {

  const [modalContent, setModalContent] = useState('names');

  const renderContent = () => {
    if (modalContent === 'names') {
      return usuariosGastos.map((user) =>
        <UnorderedList>
          <ListItem style={{ fontWeight: 'bold', fontSize: '16px', color: 'black' }} >{user.nome}</ListItem>
        </UnorderedList>
      );
    } else if (modalContent === 'itens') {

      return itensGasto.map((item) =>
        <UnorderedList>
          <ListItem style={{ fontWeight: 'bold', fontSize: '16px', color: 'black' }}>{item.quantidade} X {item.descricao} : R${item.preco_total}</ListItem>
        </UnorderedList>);
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
          <ModalHeader style={{background:'#3C5149'}}>Informações do Grupo</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ul>{renderContent()}</ul>
          </ModalBody>

          <ModalFooter>
            <Grid templateColumns="repeat(3, 1fr)" columnGap={4} alignItems="center">
            <Button onClick={() => handleButtonClick('names')} style={{ background: modalContent === 'names' ? '#6F9951' : '#CBD5E0' }}>
                Usuarios
              </Button>
              <Button onClick={() => handleButtonClick('itens')} style={{ background: modalContent === 'itens' ? '#6F9951' : '#CBD5E0'}}>
                Itens
              </Button>
              {/* <Button onClick={() => handleButtonClick('pesos')} colorScheme={modalContent === 'pesos' ? 'blue' : 'gray'}>
                Pesos
              </Button> */}
              <Button colorScheme='red' mr={3} onClick={onClose}>
                Fechar
              </Button>
            </Grid>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>

  );

}
