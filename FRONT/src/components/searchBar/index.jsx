import React, { useState } from "react";
import './style.css';

export default function SearchBar(props){

    const [searchType, setSearchType] = useState('');
    const [searchValue, setSearchValue] = useState('');

    function handleValueInput(e) {
        setSearchValue(e.target.value);
        props.setValueSearch(searchValue);
    }

    function handleTypeInput(e) {
        setSearchType(e.target.value);
        props.setSearchType(searchType);
    }

    return (
        <div>
            <input
            onInput={handleValueInput}
            type="text"
            placeholder="Pesquise seu gasto"
           />
            <select 
            onChange={handleTypeInput}>     
                <option value="">Tipo de Pesquisa</option>          
                <option value="status">Status</option>
                <option value="tags">Tags</option> 
            </select>
        </div>
    )
}
