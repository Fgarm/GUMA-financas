import React, { useState } from "react";
import './style.css';

export default function SearchBar(props){

    //const [searchType, setSearchType] = useState('');

    function handleValueInput(e) {

        const value = e.target.value;
        
        if(value.toLowerCase() == 'pago'){
            // setSearchValue(true)
            // console.log(searchValue)
            props.setValueSearch(true);
        } else if(value.toLowerCase() == 'não pago'){
            // setSearchValue(false)
            // console.log(searchValue)
            props.setValueSearch(false);
        }     
        
    }

    function handleTypeInput(e) {
        const newSearchType = e.target.value;
        //setSearchType(newSearchType);
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
                {/* <option value="tags">Tags</option>  */}
            </select>
        </div>
    )
}
