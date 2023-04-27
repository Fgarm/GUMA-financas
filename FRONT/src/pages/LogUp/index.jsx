import React, { useState, useCallback } from 'react';
import './style.css'

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { Input, InputGroup, InputRightElement, Button, Link } from '@chakra-ui/react';

import axios from 'axios';

export default function LogUp() {

  const navigate = useNavigate();

  const createUserFormSchema = z.object(
    {
      username: z.string()
        .nonempty('Este item é obrigatório')
        .regex(/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/, 'O nome não pode conter números e símbolos'),

      first_name: z.string()
        .nonempty('Este item é obrigatório')
        .regex(/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/, 'O nome não pode conter números e símbolos')
        .transform(name => {
          return name[0].toLocaleUpperCase().concat(name.substring(1))
        }),

      last_name: z.string()
        .nonempty('Este item é obrigatório')
        .regex(/^[^0-9]*$/, 'O nome não pode conter números')
        .transform(last_name => {
          return last_name[0].toLocaleUpperCase().concat(last_name.substring(1))
        }),


      email: z.string()
        .nonempty('Este item é obrigatório')
        .email('Formato de email inválido')
        .toLowerCase(),

      password: z.string()
        .nonempty('Este item é obrigatório')
        .min(6, 'Mínimo de 6 caracteres')
    }
  )

  const [visible, setVisible] = useState(false)

  const handleVisibleChange = useCallback(() => {
    setVisible((prevState) => !prevState);
  }, []);


  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm(
    {
      resolver: zodResolver(createUserFormSchema)
    }
  )

  const onSubmit = (data) => {
    console.log(data);
    axios.post('http://localhost:8000/auth/cadastro/', data)
      .then(response => {
        if (response.status === 200) {

          navigate('/', { replace: true });
        } else if (response.status === 409) {
          alert('Usuário ou email já cadastrados no sistema')
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

  return (

    <main>

      <form className='formUp' onSubmit={handleSubmit(onSubmit)}>

        <div>

          <label htmlFor='first_name'>Nome</label>
          <br></br>

          <Input
            type="text"
            id='first_name'
            name='first_name'
            {...register('first_name')}
            htmlSize={27}
            width='auto'
          />

          {errors.first_name && <span className='error'>{errors.first_name.message} </span>}

        </div>

        <div>

          <label htmlFor="last_name">Sobrenome</label>
          <br></br>

          <Input
            type="text"
            id='last_name'
            name='last_name'
            {...register('last_name')}
            htmlSize={27}
            width='auto'
          />

          {errors.last_name && <span className='error'>{errors.last_name.message} </span>}

        </div>

        <div>

          <label htmlFor="username">Username</label>
          <br></br>

          <Input
            type="text"
            id='username'
            name='username'
            {...register('username')}
            htmlSize={27}
            width='auto'
          />

          {errors.username && <span className='error'>{errors.username.message} </span>}

        </div>

        <div>

          <label htmlFor="email">E-mail</label>
          <br></br>

          <Input
            type="email"
            id='email'
            name='email'
            {...register('email')}
            htmlSize={27}
            width='auto'
          />

          {errors.email && <span className='error'>{errors.email.message}</span>}

        </div>

        <div>

          <label htmlFor="password">Senha</label>

          <br></br>

          <InputGroup size='md'>
            <Input
              pr='4.5rem'
              type={visible ? 'text' : 'password'}
              id='password'
              name='password'
              {...register('password')}
            />

            <InputRightElement width='2.5rem' onClick={handleVisibleChange}>
              {visible ? <ViewIcon color='black.300' /> : <ViewOffIcon />}
            </InputRightElement>
          </InputGroup>

          {errors.password && <span className='error'>{errors.password.message} </span>}

        </div>

        <Button type="submit" colorScheme='teal' variant='solid' size="md">Registrar</Button>

        <Link href="/" color='blue.500'>Já tem uma conta&#63;</Link>

      </form>

    </main>

  )

}
