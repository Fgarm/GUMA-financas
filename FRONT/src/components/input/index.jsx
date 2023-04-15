import React, { useState } from 'react'


import './style.css'

import { FaEyeSlash, FaEye } from 'react-icons/fa';

import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'


export default function Input() {

  const [eye, setEye] = useState(false)
  const eyeSlashIcon = <FaEyeSlash/>;
  const eyeIcon = <FaEye/>;
  
  const [output, setOutput] = useState('')

  const createUserFormSchema = z.object(
    {
     name: z.string()
        .nonempty('Este item é obrigatório')
        //.regex(/^[^0-9]*$/, 'O nome não pode conter números')
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

