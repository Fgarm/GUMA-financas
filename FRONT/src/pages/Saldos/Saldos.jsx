import SaldoBlock from "../../components/SaldoBlock/index.jsx"
import ExtratoNavbar from "../../components/extratoNavbar/ExtratoNavbar.jsx"
import Sidebar from "../../components/sidebar/index.jsx"

const username = localStorage.getItem('cadastro_user')

export default function Saldo(){
    return(
        <div>
            <SaldoBlock />
        </div>
    )
}