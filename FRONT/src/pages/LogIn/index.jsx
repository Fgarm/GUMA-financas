import React, { useState, useCallback } from 'react';

import './style.css';

import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import Button from '../../components/button';
import ShowHidePassword from '../../components/showHidePassword';

import axios from 'axios';


export default function LogUp() {

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
    axios.get('http://localhost:8000/api/v1/usuario', JSON.stringify(data))
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

                    <label htmlFor="email">E-mail</label>
                    <br></br>

                    <input
                    type="email"
                    id='email'
                    {...register('email')}
                    />

                    {errors.email && <span>{errors.email.message}</span>}

                  </div>

                  <div>

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

                  <Button type="submit" text="Entrar"/>
                  
              </form>

            </main>

    )
    
}

