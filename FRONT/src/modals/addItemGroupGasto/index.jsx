import React, { useState, useEffect } from 'react';

import {
  ChakraProvider,
  Checkbox,
  CheckboxGroup,
  Flex,
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


export default function AddItemGroupGasto({ isOpen, onClose, groups_id, usuariosGastos, usuariosGrupo, clicks }) {
  console.log("AQUI TESTE")
  console.log(usuariosGrupo)
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

  function CheckboxList({ usuariosGrupo }) {
    return (
      <Stack spacing={2}>
        {usuariosGrupo && usuariosGrupo.map((user) => (
          <FormControl>
            <ChakraProvider>
              <Grid templateColumns="1fr 1fr" gap={4}>
                <GridItem>
                  <Checkbox key={user.id}>{user.nome}</Checkbox>
                </GridItem>
                <GridItem>
                  <Input placeholder="Peso" _placeholder={{ color: 'inherit' }} borderColor="black" focusBorderColor="black" />
                </GridItem>
              </Grid>
            </ChakraProvider>
          </FormControl>
        ))}
      </Stack>
    );
  }


  return (
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
      <FormLabel>Participantes e consumo</FormLabel>
      <div>
        <CheckboxList usuariosGrupo={usuariosGrupo} />
      </div>
      <br></br>
      <Flex justifyContent="flex-start">
        <Button marginRight="0.5rem">Cadastrar Item</Button>
        <Button marginRight="0.5rem" onClick={onClose}>Excluir</Button>
      </Flex>


    </div>
  );

}
