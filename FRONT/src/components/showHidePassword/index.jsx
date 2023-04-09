import './style.css';

export default function ShowHidePassword(props) {

    return (
        <div className="show-hide-password">
            <span>Mostrar Senha</span> 
            <input type="checkbox" onClick={props.click}/>
        </div>
    )
}