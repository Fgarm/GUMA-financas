import React from "react";
import './style.css';

export default function SearchBar(props){

    return (
        <div>
            <input
            list="options"
            type="text"
            placeholder="Pesquise seu gasto"
           />
            <select>     
                <option value="">Tipo de Pesquisa</option>          
                <option value="nome">Nome</option>
                <option value="valor">Valor</option>
                <option value="data">Data</option>
                <option value="status">Status</option>
            </select>
        </div>
    )
}
