import React, { useState, useCallback } from 'react';

import './style.css';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';


import { Input, InputGroup, InputRightElement, Button, Link, Image, useToast } from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

import { useNavigate } from 'react-router-dom';

import axios from 'axios';


export default function LogIn() {
  localStorage.clear()
  const navigate = useNavigate()
  const toast = useToast()

  const createUserFormSchema = z.object(
    {
      username: z.string()
        .nonempty('Este item é obrigatório'),

      password: z.string()
        .nonempty('Este item é obrigatório')
        .min(6, 'Mínimo de 6 caracteres')
    }
  )


  const [visible, setVisible] = useState(false)

  const handleVisibleChange = useCallback(() => {
    setVisible((prevState) => !prevState)
  }, [])


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
    axios.post('http://localhost:8000/auth/login/', data)
      .then(response => {
        if (response.status === 200 && response.data.access) {
          localStorage.setItem('cadastro_user', data.username)
          localStorage.setItem('token', response.data.token)
          navigate('/home', { replace: true })
        } else {
          toast({
            title: 'Usuário ou email incorretos',
            status: 'error',
            isClosable: true,
            duration: 3000,
          })
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  return (

    <div className='form-page-container'>
      <form className='formUp' onSubmit={handleSubmit(onSubmit)}>
        
        <div className='white-guma-logo'>
        <Image src="../../guma-white.png" alt="Descrição da imagem" />
        </div>

        <div>
        

          <label style={{ color: '#D5DDDF' }} htmlFor="username">Username</label>
          <br></br>

          <Input
            type="text"
            style={{ color: '#D5DDDF' }}
            id='username'
            {...register('username')}
            htmlSize={27}
            width='auto'
          />

          {errors.username && <span className='error'>{errors.username.message}</span>}

        </div>

        <div>

          <label style={{ color: '#D5DDDF' }} htmlFor="password">Senha</label>
          <br></br>

          <InputGroup size='md'>
            
            <Input
              pr='4.5rem'
              style={{ color: '#D5DDDF' }}
              type={visible ? 'text' : 'password'}
              id='password'
              {...register('password')}
            />

            <InputRightElement style={{ marginRight: '0.5rem' }} width='2.5rem' onClick={handleVisibleChange}>

              {visible ? <ViewIcon color='#6F9951' /> : <ViewOffIcon color='#6F9951' />}

            </InputRightElement>
          </InputGroup>

          {errors.password && <span className='error'>{errors.password.message} </span>}

        </div>


        <Button type="submit" className='submit-button' variant='solid' size="md">Entrar</Button>

        <p className='center'>Não possui conta&#63; <Link href="/logup" color="blue.500">Cadastre-se</Link></p>

      </form>
    </div>
  )

}
