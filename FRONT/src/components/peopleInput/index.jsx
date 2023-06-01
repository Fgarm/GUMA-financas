import { useState, useEffect } from "react";

export default function PeopleInput(props) {
    const [usuarios, setUsuarios] = useState('')
    const [people, setPeople] = useState(["Thiago", "João", "Maria", "José", "Pedro", "Paulo", "Lucas", "Luciana", "Luiza", "Luiz", "Luizinho", "Lui"])
    const [addedPeople, setAddedPeople] = useState([])

    useEffect(() => {
        props.onUsuariosChange(usuarios);
    }, [usuarios]);

    function handleChange(e) {
        const value = e.target.value
        if (!value.trim()) return

        if (addedPeople.includes(value)) {
            e.target.value = '';
            return;
        }

        const newPeople = [...addedPeople, value];
        setAddedPeople(newPeople);
        e.target.value = ''

        if(usuarios === ''){
            setUsuarios(value)
        }else{
            setUsuarios(usuarios+','+value)
        }
     }

     function removePerson(index, value) {
        const newPeoples = addedPeople.filter((el, i) => i !== index);
        setAddedPeople(newPeoples);

        const nomesArray = usuarios.split(','); 
        const novoArray = nomesArray.filter((item) => item.trim() !== value.trim());
        const novaString = novoArray.join(',');
        setUsuarios(novaString); 
    }


    return (
        <div>
            <div className="people-input-container">
                {addedPeople.map((nome, index) => (
                    <div className="people-items" key={index}>
                        <span className="text">{nome}</span>
                        <span className="close" onClick={() => removePerson(index, nome)}>&times;</span>
                    </div>
                ))}

                <select name="people" id="people" className="people-input" onChange={handleChange}> 

                    <option value="">Usuários</option>

                    {props.usuarios.length === 0 ? <p></p> :
                     (
                        props.usuarios.map((nome, key) => (
                            <option value={nome.username}>{nome.nome}</option>
                        ))
                    )}
                </select>

            </div>

        </div>
    )
};

