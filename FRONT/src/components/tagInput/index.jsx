import { useState } from "react";

export default function TagsInput(props) {
    const user = props.user
    const cor = 'dad8d8'

    function handleChange(e) {

        const value = e.target.value

        const categoria = value

        const newTag = { categoria, cor, user }

        props.onTagsChange(newTag);
    }


    return (

        <div>
            <div className="tags-input-container">

                <select name="tags" id="tags" className="tags-input" onChange={handleChange} value={props.editado}> 
                    
                    <option value=""></option>

                    {props.tags.length === 0 ? <p></p> :
                     (
                        props.tags.map((tags, key) => (
                            <option value={tags.categoria}>{tags.categoria}</option>
                        ))
                    )}

                </select>

            </div>

        </div>
    )
};

