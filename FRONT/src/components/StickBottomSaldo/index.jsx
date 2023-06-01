import axios from 'axios'
import {ContainerBotton, Button} from './style'
import AddSaldo_modal from '../../modals/addSaldo'
import { useState } from 'react'

const BaseUrl = "http://127.0.0.1:8000/bancario/add-saldo/"
const username = localStorage.getItem('cadastro_user')

export default function StickBotton(){
    
    const [isOpen, setIsOpen] = useState(false)
    
    return(
        <div>
            <Button onClick={() => setIsOpen(true)}>Add-Saldo</Button>
            <AddSaldo_modal isOpen={isOpen} setIsOpen={() => setIsOpen(!isOpen)}/>
        </div>
    )
}