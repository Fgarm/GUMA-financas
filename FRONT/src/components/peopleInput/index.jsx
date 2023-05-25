import { useState } from "react";

export default function PeopleInput(props) {
    const user = props.user
    const cor = 'dad8d8'

    const [usuario, setUsuario] = useState('')
    const [people, setPeople] = useState(["Thiago", "João", "Maria", "José", "Pedro", "Paulo", "Lucas", "Luciana", "Luiza", "Luiz", "Luizinho", "Lui"])
    const [addedPeople, setAddedPeople] = useState([])

    function handleChange(e) {
        const value = e.target.value
        if (!value.trim()) return
        if (addedPeople.some(tag => tag.categoria === value)) {
            e.target.value = '';
            return;
        }
        const newPeople = [...addedPeople, value];
        setPeople(newPeople);
        e.target.value = ''
    }

    function handleChange(e) {
        const value = e.target.value
        setUsuario(usuario+','+value)
    }


    return (

        <div>
            <div className="people-input-container">

                {addedPeople.map((tag, index) => (
                    <div className="people-items" key={index}>
                        <span className="text">{tag}</span>
                        <span className="close" onClick={() => removeTags(index)}>&times;</span>
                    </div>
                ))}

                <select name="tags" id="tags" className="tags-input" onChange={handleChange}> 
                    
                    <option value=""></option>

                    {people.length === 0 ? <p></p> :
                     (
                        people.map((tags, key) => (
                            <option value={tags}>{tags}</option>
                        ))
                    )}

                </select>

            </div>

        </div>
    )
};

