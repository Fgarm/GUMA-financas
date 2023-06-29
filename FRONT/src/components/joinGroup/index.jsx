import React, {useEffect, useRef,} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';

export default function EntrarComLink() {

    const navigate = useNavigate();
    const toast = useToast();

    const dataF = useRef(false);
    const username = localStorage.getItem('cadastro_user');
    // console.log("URL:", window.location)

    const params = new URLSearchParams(window.location.search);
    // console.log(params.get("grupo"))
    
    const grupo_id = params.get("grupo")
    const entrarNoGrupo = async () => {
        try{
            await axios({
                method: "post",
                url: "http://localhost:8000/grupos/associar-usuario-grupo/",
                data: {
                    grupo_id: grupo_id,
                    user: username
                },
            })
            localStorage.setItem('grupo_id', grupo_id)
            toast({
                title: 'Você entrou no grupo',
                status: 'success',
                isClosable: true,
                duration: 3000,
              });
            navigate('/group')

        }
        catch(error) {
            toast({
                title: 'Já cadastrado no grupo',
                status: 'error',
                isClosable: true,
                duration: 3000,
              });
            console.log(error)   // Criar página pra os diferentes erros, ou levar para uma página de grupo menos específica
            navigate('/home')
            // alert("Link inválido.")
        }
    }

    useEffect(() => {
        if(dataF.current) return;
        dataF.current = true;
        entrarNoGrupo();
    }, []);
    
}
