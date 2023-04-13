import React from "react";
import './style.css';

export default function SearchBar(props){

    return (
        <div>
            <input
            type="text"
            placeholder={props.placeholder}
            onChange={(e) => {
              setSearchInput(e.target.value)
            }}/>
        </div>
    )
}
