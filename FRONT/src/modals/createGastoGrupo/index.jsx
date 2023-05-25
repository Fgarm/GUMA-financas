import React, { useState, useEffect } from 'react';

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

export default function CreateGastoGroup({ isOpen, onClose, initialRef, finalRef, groups_id, handleCreateSuccess, userClicked}) {

  const grupoId = localStorage.getItem('grupo_id');
  
  const [users, setUsers] = useState([]);

  const [nome, setNome] = useState('');
  const token = localStorage.getItem('token');
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    getUsuarios()
  }, [userClicked])

  function getUsuarios() {
    const grupo_id = groups_id;
    console.log(grupo_id)
    console.log("pegando usuarios do grupo")
    axios.post('http://localhost:8000/usuarios/usuarios-grupo/', grupo_id)
      .then(response => {
        setUsuarios(response.data)
        console.log(response.data)
      })
      .catch(error => {
        console.log(error)
      })
  }



  const handleSubmit = () => {

    const data = {
      nome_gasto: nome,
      id_grupo_id: groups_id,
    }

    axios.post('http://localhost:8000/grupos/cadastrar-gasto-grupo/', data)//{
    //     headers: {
    //         'Authorization': `Bearer ${token}`
    //       }
    // })
      .then(response => {
        if (response.status === 201) { 
          onClose()
          handleCreateSuccess()
        } else if (response.status === 409) {
          alert('Grupo de nome já cadastrado no sistema')
        } else if (response.status === 400) {
          alert('Dados de cadastro não estão nos parâmetros aceitos')
        } else {
          alert('Erro de solicitação')
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  const addGastoGroupUser = () => {
    axios({
      method: "post",
      url: "http://localhost:8000/grupos/associar-user-grupoGastos/",
      data: {
        grupo_id: grupoId
      },
    })
      .then((response) => { 
        setUsers(response.data);
        console.log(grupoId)
        console.log(users)
        setShouldRunEffect(true)
      })
      .catch(error => {
        console.log(error);
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
              Criando Gasto do Grupo
            </ModalHeader>

            <ModalBody>
              <FormControl mt={4}>
                <label>Nome</label>
                <br></br>
                <Input onChange={(e) => {
                  setNome(e.target.value)
                }} />
              </FormControl>
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

{/* <div>
<div className="tags-input-container">

    <select name="tags" id="tags" className="tags-input" onChange={handleChange} value={props.editado}> 
        
        <option value=""></option>

        {props.tags.length === 0 ? <p></p> :
         (
            props.tags.map((tags, key) => (
                <option value={tags.categoria}>{tags.categoria}</option>
            ))
        )}

    </select>

</div>

</div> */}
