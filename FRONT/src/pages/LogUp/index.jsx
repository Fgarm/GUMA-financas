import React, { useState, useCallback } from 'react';
import './style.css'

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useNavigate } from 'react-router-dom';

import { Input, InputGroup, InputRightElement, Button, Link } from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

import axios from 'axios';

export default function LogUp() {

  const navigate = useNavigate();

  const createUserFormSchema = z.object(
    {
     name: z.string()
        .nonempty('Este item é obrigatório')
        .regex(/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/, 'O nome não pode conter números e símbolos')
        .transform(name => {
          return name[0].toLocaleUpperCase().concat(name.substring(1))
        }),

        
      lastName: z.string()
        .nonempty('Este item é obrigatório')
        .regex(/^[^0-9]*$/, 'O nome não pode conter números')
        .transform(lastName => {
          return lastName[0].toLocaleUpperCase().concat(lastName.substring(1))
        }),
        
      userName: z.string()
        .nonempty('Este item é obrigatório')
        .regex(/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/, 'O nome não pode conter números e símbolos'),

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
    
    axios.post('http://localhost:8000/api/v1/usuario', JSON.stringify(data))
    .then(response => {
      console.log(response);
      navigate('/home', {replace: true});
      })
      .catch(error => {
        console.log(error);
      });
  }

    return (

            <main>

              <form className='formUp' onSubmit={handleSubmit(onSubmit)}>

                  <div>

                    <label htmlFor='name'>Nome</label>
                    <br></br>

                    <Input
                    type="text"
                    id='Name'
                    {...register('name')}
                    htmlSize={27}
                     width='auto'
                    />
              
                    {errors.name && <span className='error'>{errors.name.message} </span>}

                  </div>

                  <div>

                    <label htmlFor="lastName">Sobrenome</label>
                    <br></br>

                    <Input
                    type="text"
                    id='lastName'
                    {...register('lastName')}
                    htmlSize={27}
                    width='auto'
                    />

                    {errors.lastName && <span className='error'>{errors.lastName.message} </span>}

                  </div>

                  <div>

                    <label htmlFor="userName">Username</label>
                    <br></br>

                    <Input
                    type="text"
                    id='userName'
                    {...register('userName')}
                    htmlSize={27}
                     width='auto'
                    />

                    {errors.userName && <span className='error'>{errors.userName.message} </span>}

                  </div>

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

                  <Button type="submit" colorScheme='teal' variant='solid' size="md">Registrar</Button>

                  <Link href="/"  color='blue.500'>Já tem uma conta&#63;</Link>

              </form>

            </main>

    )
    
}

