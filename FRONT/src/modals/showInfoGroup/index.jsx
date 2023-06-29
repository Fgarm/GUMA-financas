import React, { useState } from 'react';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  Grid,
  Button,
  ListItem,
  UnorderedList,
  ModalHeader,
  Text
} from '@chakra-ui/react'

export default function ShowInfoGroup({ isOpen, onClose, user, itensGasto, usuariosGastos, gasto_id }) {

  const [modalContent, setModalContent] = useState('nomes');

  function renderContent() {
    if (modalContent === 'nomes') {
      return (
        <>
          <UnorderedList>
            <Text fontSize='lg' color='black'> Usuários: </Text>
            <div>
              {usuariosGastos.map((user) => (
                <Text fontSize='lg' display="flex" justifyContent="flex-end" color='black'>
                  {user.nome}
                </Text>
              ))}
            </div>
            <div>
              <Text fontSize='lg' color='black'> Itens:  </Text>
              {itensGasto.map((item) => (
                <Text fontSize='lg' display="flex" justifyContent="flex-end" color='black'>
                  {item.quantidade} X {item.descricao} : {parseFloat(item.preco_total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </Text>
              ))}
            </div>
          </UnorderedList>
        </>
      );
    }

    return null;
  };


  function handleButtonClick(content) {
    setModalContent(content);
  };

  return (
    <div>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader style={{ background: '#3C5149' }}>Informações do Grupo</ModalHeader>
          <ModalBody>
            <ul>{renderContent()}</ul>
          </ModalBody>

          <ModalFooter>
            {/* <Grid templateColumns="repeat(3, 1fr)" columnGap={4} alignItems="center"> */}
            {/* <Button onClick={() => handleButtonClick('nomes')} style={{ background: modalContent === 'nomes' ? '#6F9951' : '#CBD5E0' }}>
                Usuarios
              </Button>
              <Button onClick={() => handleButtonClick('itens')} style={{ background: modalContent === 'itens' ? '#6F9951' : '#CBD5E0' }}>
                Itens
              </Button> */}
            {/* <Button onClick={() => handleButtonClick('pesos')} colorScheme={modalContent === 'pesos' ? 'blue' : 'gray'}>
                Pesos
              </Button> */}
            <Button colorScheme='red' mr={3} onClick={() => {
              setModalContent('nomes')
              onClose()
            }}>
              Fechar
            </Button>
            {/* </Grid> */}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>

  );

}
