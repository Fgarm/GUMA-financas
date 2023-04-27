import React from "react";
import './style.css';

export default function SearchBar(props){

    function handleValueInput(e) {

        const value = e.target.value;

        if(value.toLowerCase() == 'pago'){
            props.setValueSearch(true);
        } else if(value.toLowerCase() == 'não pago'){
            props.setValueSearch(false);
        } else {
            props.setValueSearch(value.toLowerCase())
        }

    }

    function handleTypeInput(e) {
        const newSearchType = e.target.value;
        props.setSearchType(newSearchType);
    }

    return (
        <div>
            <input
            onChange={handleValueInput}
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