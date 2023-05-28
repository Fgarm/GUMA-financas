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
  } from '@chakra-ui/react'
  
  import axios from 'axios'


export default function ShowInfoGroup({ isOpen, onClose, initialRef, finalRef, user, nomeGasto, groups_id, gasto_Id, itemGasto }) {

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
              {nomeGasto}
            </ModalHeader>

            <ModalBody>
             
            </ModalBody>

            <ModalFooter>
              <Button 
                colorScheme='blue' 
                mr={3} 
                onClick={handleSubmit}>
                Criar
              </Button>
              <Button onClick={onClose}>Cancelar</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
  
    );
    
}
