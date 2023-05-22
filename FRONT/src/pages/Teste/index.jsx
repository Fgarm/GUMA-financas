import React, {useEffect,} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function EntrarComLink() {
    
    const username = localStorage.getItem('cadastro_user');
    // console.log("URL:", window.location)
    const params = new URLSearchParams(window.location.search);
    // console.log(params.get("grupo"))
    const grupo_id = params.get("grupo")
    function entrarNoGrupo() {
        axios({
            method: "post",
            url: "http://localhost:8000/grupos/associar-usuario-grupo/",
            data: {
                grupo_id: grupo_id,
                user: username
            },
        })
        .then(response => useNavigate(`/home`, { replace: true }))
        .catch(error => {
            console.log(error)
            // Criar página pra os diferentes erros, ou levar para uma página de grupo menos específica
        })
    }
    useEffect(() => {
        entrarNoGrupo();
    }, []);

}