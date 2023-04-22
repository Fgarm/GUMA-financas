import React, { useState } from "react";
import './style.css';

export default function SearchBar(props){

    const [searchType, setSearchType] = useState('');
    const [searchValue, setSearchValue] = useState(false);

    function handleValueInput(e) {

        const value = e.target.value;
        
        if(value.toLowerCase() == 'pago' && searchType == 'Status'){
            setSearchValue(true)
            props.setValueSearch(searchValue);
        } else if(value.toLowerCase() == 'não pago' && searchType == 'Status'){
            setSearchValue(false)
            props.setValueSearch(searchValue);
        }     
        
    }

    function handleTypeInput(e) {
        const newSearchType = e.target.value;
        setSearchType(newSearchType);
        props.setSearchType(searchType);
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
                {/* <option value="tags">Tags</option>  */}
            </select>
        </div>
    )
}
