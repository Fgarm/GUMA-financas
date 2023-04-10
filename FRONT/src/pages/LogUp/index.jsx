import React, { useState, useCallback } from 'react';

import './style.css'

import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import axios from 'axios';

//import Button from '../../components/button';
import ShowHidePassword from '../../components/showHidePassword';

import Button from 'react-bootstrap/Button';


export default function LogUp() {

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

    axios.post('http://localhost:8000/api/v1/usuario', JSON.stringify(data))
      .then(response => {
        console.log(response);
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

                    <input
                    type="text"
                    id='Name'
                    {...register('name')}
                    />
              
                    {errors.name && <span>{errors.name.message} </span>}

                  </div>

                  <div>

                    <label htmlFor="lastName">Sobrenome</label>
                    <br></br>

                    <input
                    type="text"
                    id='lastName'
                    {...register('lastName')}
                    />

                    {errors.lastName && <span>{errors.lastName.message} </span>}

                  </div>

                  <div>

                    <label htmlFor="email">E-mail</label>
                    <br></br>

                    <input
                    type="email"
                    id='email'
                    {...register('email')}
                    />

                    {errors.email && <span>{errors.email.message}</span>}

                  </div>

                  <div className='password-container'>

                    <label htmlFor="password">Senha</label>
                    <br></br>

                    <input
                    type={visible ? 'text' : 'password'}
                    id='password'
                    {...register('password')}
                    />
                    
                    {errors.password && <span>{errors.password.message} </span>}

                  </div>

                  <ShowHidePassword click={handleVisibleChange}/>

                  <Button type="submit">Registrar</Button>

              </form>

            </main>

    )
    
}

