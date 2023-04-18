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
     username: z.string()
        .nonempty('Este item é obrigatório'),

     senha: z.string()
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
      axios.post('http://localhost:8000/auth/login/', data)
        .then(response => {
          console.log(response);
          if(response.status === 200){
            localStorage.setItem('cadastro_user', data.username)
            navigate('/home', {replace: true});
          } else {
            alert('Usuário não encontrado')
          }
      })
      .catch(error => {
        console.log(error);
      });
  }

    return (

              <form className='formUp' onSubmit={handleSubmit(onSubmit)}>

                  <div>

                    <label htmlFor="username">Username</label>
                    <br></br>

                    <Input
                    type="text"
                    id='username'
                    {...register('username')}
                    htmlSize={27}
                    width='auto'
                    />

                    {errors.username && <span className='error'>{errors.username.message}</span>}

                  </div>

                  <div>

                    <label htmlFor="senha">Senha</label>
                    <br></br>

                    <InputGroup size='md'>
                      <Input
                        pr='4.5rem'
                        type={visible ? 'text' : 'password'}
                        id='senha'
                        {...register('senha')}
                      />
                      
                      <InputRightElement width='2.5rem' onClick={handleVisibleChange}>
                       
                      {visible ? <ViewIcon color='black.300' /> : <ViewOffIcon/>}
                        
                       
                      </InputRightElement>
                    </InputGroup>

                    {errors.senha && <span className='error'>{errors.senha.message} </span>}

                  </div>


                  <Button type="submit" colorScheme='teal' variant='solid' size="md">Entrar</Button>

                  <p>Não possui conta&#63; <Link href="/logup" color="blue.500">Cadastre-se</Link></p>
                  
              </form>
    )
    
}

