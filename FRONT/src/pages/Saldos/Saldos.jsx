import { useEffect } from "react"
import SaldoBlock from "../../components/SaldoBlock/index.jsx"
import StickBotton from "../../components/StickBottomSaldo/index.jsx"
import ExtratoNavbar from "../../components/extratoNavbar/ExtratoNavbar.jsx"
import Sidebar from "../../components/sidebar/index.jsx"
import { Container } from "./Style.jsx"
import '../../main.css';




export default function Saldo() {

    const username = localStorage.getItem('cadastro_user')

    return (
        <div>
            <Sidebar user={username} />
            <Container className="body">

                <header className='home'>

                    <h1 className='page-title'>Meu Saldo</h1>

                    <div className='new-tag-and-gasto-button-container'>
                        
                    </div>

                </header>

                <SaldoBlock />
                <StickBotton />
                
            </Container>
        </div>
    )
}