import { useEffect, useState } from "react"
import { ContModal, ModalAddSaldo, Close, Saldo, TitleModal, ADICIONAR } from "./style"
import axios from "axios"

const BaseUrl = "http://127.0.0.1:8000/bancario/add-saldo/"
const username = localStorage.getItem('cadastro_user')

export default function AddSaldo_modal({isOpen, setIsOpen}){ 
    
    const [saldo, setSaldos] = useState(0)

    async function Cadastrar_Saldo(){
        if (saldo != 0){
            await axios.post(BaseUrl, {
                username: username,
                saldo: saldo
            }).then(response => {
                console.log(response)
                window.location.reload(true)
            });
        }else{
            alert("Saldo Zero")
        }
    }
    
    if (isOpen){
        return(
            <ContModal>
                <ModalAddSaldo>
                    <TitleModal>ADICIONAR SALDO</TitleModal>
                    <Close onClick={setIsOpen}>Close</Close>
                    <Saldo type="number" onChange={(e) => setSaldos(e.target.value)}></Saldo>
                    <ADICIONAR onClick={Cadastrar_Saldo}>ADD</ADICIONAR>
                </ModalAddSaldo>
            </ContModal>
        )
    }else{
        return null
    }
}