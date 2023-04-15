import './style.css';

export default function Button(props) {
    return (
            <div>
                <button type={props.type}>{props.text}</button>
            </div>
    )
}