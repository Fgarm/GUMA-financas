import React, { useState, useEffect } from 'react';
import './style.css';

import SearchBar from '../../components/searchBar';

export default function Home(){
    
  const [user, setUser] = useState(null);
  const [searchInput, setSearchInput] = useState("");

 
  let dados = localStorage.getItem('dados')
  console.log(dados.email);
  dados = JSON.stringify(dados)
  console.log(dados);
  var data = JSON.parse(dados)
  console.log(data);


  // useEffect(() => {
  //   // Faz uma chamada à API para buscar os dados do usuário com base no ID fornecido na propriedade
  //   axios.get(`/api/usuario/${dados.email}`)
  //     .then(response => {
  //       setUser(response.data);
  //     })
  //     .catch(error => {
  //       console.log(error);
  //     });
  // }, [dados.email]);

  // if (!user) {
  //   return <div>Carregando...</div>;
  // }

  return (
    <div>
      <header>
        <h3>dados.email</h3>
       
      </header>
    </div>
  )
}
