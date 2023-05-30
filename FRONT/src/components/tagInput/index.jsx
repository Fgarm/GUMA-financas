import { useState } from "react";

export default function TagsInput(props) {
    const user = props.user
    //const cor = 'dad8d8'

    function handleChange(e) {

        const value = e.target.value
        const cor = e.target.selectedOptions[0].getAttribute('data-cor'); // Obtém a cor selecionada
        const categoria = value

        const newTag = { categoria, cor, user }

        console.log(newTag)

        props.onTagsChange(newTag);
    }


    return (

        <div>
            <div className="tags-input-container">

                <select name="tags" id="tags" className="tags-input" onChange={handleChange} value={props.editado}> 
                    
                    <option value=""></option>

                    {props.tags.length === 0 ? (    
                        <p></p>
                    ) : (
                    props.tags.map((tag, key) => (
                        <option
                        key={key}
                        style={{ color: `#${tag.cor}` }}
                        value={tag.categoria}
                        data-cor={tag.cor}
                        >
                        {tag.categoria}
                        </option>
                    ))
                    )}

                </select>

            </div>

        </div>
    )
};

