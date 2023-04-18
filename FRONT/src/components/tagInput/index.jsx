import { useState } from "react";

export default function TagsInput(props) {

    const [tags, setTags] =  useState([])

    function handleKeyDown(e) {
        if(e.key !== 'Enter') return
        const value = e.target.value
        if(!value.trim()) return
        const newTags = [...tags, value];
        setTags(newTags);
        props.onTagsChange(newTags);
        e.target.value = ''
    }

    function removeTags(index) {
        const newTags = tags.filter((el, i) => i !== index);
        setTags(newTags);
        props.onTagsChange(newTags);
    }

    return(
        <div className="tags-input-container">
            {tags.map((tag, index) => (
                <div className="tags-items" key={index}>
                    <span className="text">{tag}</span>
                    <span className="close" onClick={() => removeTags(index)}>&times;</span>
                </div>
            ))}
            <input type="text" 
            className="tags-input" 
            placeholder="Digite o tipo de gasto (mercado, carro, ...)" 
            onKeyDown={handleKeyDown}/>
        </div>
    ) 
};

