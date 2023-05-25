import ExtratoNavbar from "../../components/extratoNavbar/ExtratoNavbar.jsx"
import Sidebar from "../../components/sidebar/index.jsx"
import { ImgBackground } from "./Style.jsx"


export default function Extratos(){
    return(
        <div>
            <Sidebar/>
            <ExtratoNavbar/>
            <ImgBackground/>
        </div>
    )
}