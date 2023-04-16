import React, { useState, useCallback } from 'react';

import './style.css';

import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';


import { Input, InputGroup, InputRightElement, Button, Link } from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

import { useNavigate } from 'react-router-dom';

import axios from 'axios';


export default function LogIn() {

  const navigate = useNavigate();

  const createUserFormSchema = z.object(
    {
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
    } = useForm (
    {
      resolver: zodResolver(createUserFormSchema)
    }
    )
    
    
    const onSubmit = (data) => {
      localStorage.setItem('dados', data);
      axios.get('http://localhost:8000/api/v1/usuario', JSON.stringify(data))
        .then(response => {
        console.log(response);
        navigate('/home', {replace: true});
      })
      .catch(error => {
        console.log(error);
      });
  }

    return (

              <form className='formUp' onSubmit={handleSubmit(onSubmit)}>

                  <div>

                    <label htmlFor="email">E-mail</label>
                    <br></br>

                    <Input
                    type="email"
                    id='email'
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
                        {...register('password')}
                      />
                      
                      <InputRightElement width='2.5rem' onClick={handleVisibleChange}>
                       
                      {visible ? <ViewIcon color='black.300' /> : <ViewOffIcon/>}
                        
                       
                      </InputRightElement>
                    </InputGroup>

                    {errors.password && <span className='error'>{errors.password.message} </span>}

                  </div>


                  <Button type="submit" colorScheme='teal' variant='solid' size="md">Entrar</Button>

                  <p>Não possui conta&#63; <Link href="/logup" color="blue.500">Cadastre-se</Link></p>
                  
              </form>
    )
    
}

