import React, { useState, useEffect } from 'react';
import '../../main.css';
import './style.css';

import Sidebar from '../../components/sidebar';

import { Icon } from '@chakra-ui/react';
import { MdDelete } from 'react-icons/md';

import { useNavigate } from 'react-router-dom';

import getMonthDay from '../../functions/getMonthDay';

import { Button, useDisclosure } from '@chakra-ui/react';

import axios from 'axios';
import AddRec from '../../modals/addRec';

export default function ShowRecorrencias() {

    const navigate = useNavigate();

    const [recorrencias, setRecorrencias] = useState([])

    const username = localStorage.getItem('cadastro_user')
    const token = localStorage.getItem('token')
    const [flag, setFlag] = useState(0)

    useEffect(() => {
        getRecorrencias()
    }, [flag])

    const { isOpen: isAddOpen, onClose: onAddClose, onOpen: onAddOpen } = useDisclosure();

    function addFlag() {
      setFlag(flag => flag + 1);
    }

    function handleDeleteClick(id) {
      axios.delete('http://127.0.0.1:8000/recorrencia/apagar-recorrencia/', { data: { id: id } })
        .then((response) => {
          if(response.status === 204){
            getRecorrencias()
          }
        })
        .catch((error) => {
          console.log(error)
        })
    }

    function getRecorrencias() {
        axios.post('http://127.0.0.1:8000/recorrencia/get-recorrencias/', { user: username })
            .then((response) => {
                setRecorrencias(response.data)
                console.log(response.data)
            })
            .catch((error) => {
                console.log(error)
         })
    }

    function handleAdd() {
      onAddOpen()
    }

    function handleCloseAdd() {
      onAddClose()
    }


    return (
      <>
      <Sidebar user={username}/>
      <div className="body">
        <header className='home'>
          <h1 className='page-title'>Minhas Recorrências</h1>

          <Button className='new-income-button recorrencia-button' onClick={handleAdd}>
            Nova Recorrência
          </Button>
        </header>

        <div>
          <AddRec isOpen={isAddOpen} onClose={onAddClose} user={username} getRec={getRecorrencias} addFlag={addFlag}>
              <Button onClick={handleCloseAdd}>Fechar</Button>
          </AddRec>
        </div>

        <div className="recorrencia">
        {recorrencias.length === 0 ? <p>Não há gastos com os parâmetros especificados</p> : (
            recorrencias.map((recorrencia, key) => (
              <div key={recorrencia.id} className="recorrencia_information">
                <p>
                  {recorrencia.nome}
                </p>

                {recorrencia.tipo != 'G' ? <p style={{ color: 'darkgreen', fontWeight: 'bold'}}>R$ {recorrencia.valor}</p> : <p style={{ color: 'red',  fontWeight: 'bold'}}>R$ -{recorrencia.valor}</p> }

                <p>
                  {getMonthDay(recorrencia.data)}
                </p> 

                <p>
                  {recorrencia.frequencia === 'D' && (
                    <span>Diária</span>
                  )}
                  
                  {recorrencia.frequencia === 'S' && (
                    <span>Semanal</span>
                  )}
                  
                  {recorrencia.frequencia === 'M' && (
                    <span>Mensal</span>
                  )}
                  
                  {recorrencia.frequencia === 'A' && (
                    <span>Anual</span>
                  )}
                </p>

                <p>
                  {recorrencia.tag}
                </p>

                <div>
                  <Icon 
                    className='delete-icon-gasto' 
                    as={MdDelete} 
                    color='red.500' 
                    w={5} 
                    h={5} 
                    onClick={() => handleDeleteClick(recorrencia.id)} 
                  />
                </div>

              </div>
            ))

          )}
        </div>


      </div>
      </>
    )
}
