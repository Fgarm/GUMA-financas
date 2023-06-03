import React, { useState, useEffect } from 'react';

import {
  ChakraProvider,
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Input,
  Button,
  useToast,
  Stack
} from '@chakra-ui/react';

import axios from 'axios';

import './style.css';


export default function AddItemGroupGasto({ isOpen, onClose, initialRef, finalRef, nomeGasto, groups_id, gastoId, usuariosGastos, clicks }) {

  // const users = [
  //   { id: 1, name: 'User 1' },
  //   { id: 2, name: 'User 2' },
  //   { id: 3, name: 'User 3' },
  // ];

  const toast = useToast()

  const [checkedItems, setCheckedItems] = React.useState([false, false])
  const [userCheckboxes, setUserCheckboxes] = useState([]);

  const allChecked = checkedItems.every(Boolean)
  const isIndeterminate = checkedItems.some(Boolean) && !allChecked

  const [nome, setNome] = useState('');
  const [valor, setValor] = useState(0);
  const [quantidade, setQuantidade] = useState(0);
  const [descricao, setDescricao] = useState('');
  const token = localStorage.getItem('token');

  const [usuarios, setUsuarios] = useState([]);

  const [pesos, setPesos] = useState('');

  // useEffect(() => {
  //     const usuariosString = usuariosGastos.map(usuario => usuario.nome).join(',');
  //     setUsuarios(usuariosString);
  // }, [usuariosGastos]);

  useEffect(() => {
    console.log(usuariosGastos);

    if (usuariosGastos) {
      const usuariosArray = usuariosGastos.map(usuario => ({
        nome: usuario.nome,
        username: usuario.username
      }));
      setUsuarios(usuariosArray);
    }
  }, [usuariosGastos, clicks]);



  const handleSubmit = () => {

    const usernames = usuarios.map(user => user.username);

    let users = '';

    for (let i = 0; i < usernames.length; i++) {
      if (i === usernames.length - 1) {
        users = users + usernames[i];
        break;
      } else {
        users = usernames[i] + ',';
      }
    }

    const data = {
      preco_unitario: parseFloat(valor),
      quantidade: parseInt(quantidade, 10),
      descricao: descricao,
      id_GastosGrupo_id: gastoId,
      usuarios: users,
      pesos: pesos
    }

    console.log(data.id_GastosGrupo_id);

    console.log(JSON.stringify(data))

    axios.post('http://localhost:8000/grupos/cadastrar-item-associar-user/', data)//{
      //     headers: {
      //         'Authorization': `Bearer ${token}`
      //       }
      // })
      .then(response => {
        if (response.status === 200) {
          onClose()
          toast({
            title: 'Item criado',
            status: 'success',
            isClosable: true,
          });
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

  const handleCheckboxChange = (userId) => (e) => {
    const updatedUserCheckboxes = userCheckboxes.map((userCheckbox) => {
      if (userCheckbox.userId === userId) {
        return {
          ...userCheckbox,
          checked: e.target.checked,
        };
      }
      return userCheckbox;
    });
    setUserCheckboxes(updatedUserCheckboxes);
  };

  const initializeUserCheckboxes = () => {
    const initialUserCheckboxes = usuariosGastos.map((user) => ({
      userId: user.id,
      checked: false, // Definido como false para não ficarem selecionados
    }));
    setUserCheckboxes(initialUserCheckboxes);
  };

  // Inicializar os checkboxes ao montar o componente
  useEffect(() => {
    initializeUserCheckboxes();
  }, []);


  return (
    //   <div>
    //   {/* <Modal
    //     initialFocusRef={initialRef}
    //     finalFocusRef={finalRef}
    //     isOpen={isOpen}
    //     onClose={onClose}
    //   >
    //     <ModalOverlay />
    //     <ModalContent>
    //       <ModalHeader 
    //         mb={0} 
    //         className='modal_header'>
    //         {nomeGasto}
    //       </ModalHeader>

    //       <ModalBody>
    //         <FormControl mt={4}>
    //           <label>Item</label>
    //           <br></br>
    //           <Input onChange={(e) => {
    //             setDescricao(e.target.value)
    //           }} />
    //         </FormControl>

    //         <FormControl mt={4}>
    //           <label>Quantidade</label>
    //           <br></br>
    //           <Input 
    //           onChange={(e) => {
    //             setQuantidade(e.target.value)
    //           }} />
    //         </FormControl>

    //         <FormControl mt={4}>
    //           <label>Preço Unitário</label>
    //           <br></br>
    //           <Input onChange={(e) => {
    //             setValor(e.target.value)
    //           }} />
    //         </FormControl>

    //         <FormControl mt={4}>
    //           <label>Usuários do Gasto</label>
    //           <br></br>
    //           <Input
    //             defaultValue={usuarios.map(user => user.nome).join(',')}
    //             onChange={(e) => {
    //               const inputUsernames = e.target.value.split(',');
    //               const selectedUsers = usuarios.filter(user => inputUsernames.includes(user.nome));
    //               setUsuarios(selectedUsers);
    //             }}/>
    //         </FormControl>

    //         <FormControl mt={4}>
    //           <label>Pesos</label>
    //           <br></br>
    //           <Input onChange={(e) => {
    //             setPesos(e.target.value)
    //           }} />
    //         </FormControl>
    //       </ModalBody>

    //       <span className='modal_footer'>
    //         <p>Os pesos devem ser colocados referentes à ordem de usuários do gasto</p>
    //       </span>

    //       <ModalFooter>
    //         <Button 
    //           colorScheme='blue' 
    //           mr={3} 
    //           onClick={handleSubmit}
    //           >
    //           Criar
    //         </Button>
    //         <Button onClick={onClose}>Cancelar</Button>
    //       </ModalFooter>
    //     </ModalContent>
    //   </Modal> */}
    // </div>
    <div>
      <FormControl>
        <Input placeholder='Nome do item' _placeholder={{ color: 'inherit' }} borderColor="black" focusBorderColor="black" />
        {/* <FormHelperText>We'll never share your email.</FormHelperText> */}
      </FormControl>
      <br></br>
      <FormControl>
        <ChakraProvider>
          <Grid templateColumns="1fr 1fr" gap={4}>
            <GridItem>
              <Input placeholder="Custo" _placeholder={{ color: 'inherit' }} borderColor="black" focusBorderColor="black" />
            </GridItem>
            <GridItem>
              <Input placeholder="Quantidade" _placeholder={{ color: 'inherit' }} borderColor="black" focusBorderColor="black" />
            </GridItem>
          </Grid>
        </ChakraProvider>
      </FormControl>
      <br></br>
      {/* <>
        <Checkbox
          isChecked={allChecked}
          isIndeterminate={isIndeterminate}
          onChange={(e) => setCheckedItems([e.target.checked, e.target.checked])}
        >
          Todos usuários
        </Checkbox>
        <Stack pl={6} mt={1} spacing={1}>
          <Checkbox
            isChecked={checkedItems[0]}
            onChange={(e) => setCheckedItems([e.target.checked, checkedItems[1]])}
          >
            Child Checkbox 1
          </Checkbox>
          <Checkbox
            isChecked={checkedItems[1]}
            onChange={(e) => setCheckedItems([checkedItems[0], e.target.checked])}
          >
            Child Checkbox 2
          </Checkbox>
        </Stack>
      </> */}
      <FormLabel>Participantes e consumo</FormLabel>
      <>
        {userCheckboxes.map((userCheckbox) => {
          const user = usuariosGastos.find((user) => user.id === userCheckbox.userId);
          return (
            <div key={userCheckbox.userId}>
              <Checkbox
                isChecked={userCheckbox.checked}
                onChange={handleCheckboxChange(userCheckbox.userId)}
              >
                {user.name}
              </Checkbox>
            </div>
          );
        })}
      </>
      <br></br>
      <Button>Criar</Button>
      <Button>Cancelar</Button>
    </div>
  );

}
