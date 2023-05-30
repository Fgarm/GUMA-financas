import { useEffect } from "react"
import SaldoBlock from "../../components/SaldoBlock/index.jsx"
import StickBotton from "../../components/StickBottomSaldo/index.jsx"
import ExtratoNavbar from "../../components/extratoNavbar/ExtratoNavbar.jsx"
import Sidebar from "../../components/sidebar/index.jsx"
import {Container} from "./Style.jsx"




export default function Saldo(){

    return(
        <div>
            <Sidebar />
            <ExtratoNavbar />
            <SaldoBlock />
            <StickBotton />
        </div>
    )
}