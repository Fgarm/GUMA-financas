import React, { useState } from 'react'

import Button from '../../components/button';

import './style.css'

import { FaEyeSlash, FaEye } from 'react-icons/fa';

import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'


export default function LogUp() {

  const [eye, setEye] = useState(false)
  const eyeSlashIcon = <FaEyeSlash/>;
  const eyeIcon = <FaEye/>;
  
  const [output, setOutput] = useState('')

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
  

  const { 
    register,
    handleSubmit, 
    formState: { errors }  
    } = useForm (
    {
      resolver: zodResolver(createUserFormSchema)
    }
  )


  function createUser(data) {
     setOutput(JSON.stringify(data, null, 4))
     console.log(output)
     console.log(data)
  }


  const togglePassword = () => {
    setPasswordShowned(!setPasswordShowned);
  };

    return (

            <main>

              <form className='formUp' onSubmit={handleSubmit(createUser)}>

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
                    type="password"
                    id='password'
                    {...register('password')}
                    />

                    {errors.password && <span>{errors.password.message} </span>}

                  </div>

                  <Button type="submit" text="Registrar"/>
                  
              </form>

            </main>

    )
    
}

