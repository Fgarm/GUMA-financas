import ExtratoNavbar from "../../components/extratoNavbar/ExtratoNavbar.jsx"
import Sidebar from "../../components/sidebar/index.jsx"
import { ImgBackground } from "./Style.jsx"

const username = localStorage.getItem('cadastro_user')

export default function Extratos(){

    const username = localStorage.getItem('cadastro_user');

    return(
        <div>
            <Sidebar user={username}/>
            <ExtratoNavbar/>
            <ImgBackground/>
        </div>
    )
}