import React from "react";
import './style.css';

import { Input } from "@chakra-ui/react";

export default function SearchBar(props){

    return (
        <div>
            <input
            type="text"
            placeholder="Pesquise seu gasto"
           />
        </div>
    )
}
