import { useState } from "react";

export default function TagsInput() {

    const [tags, setTags] =  useState([])

    function handleKeyDown(e) {
        if(e.key !== 'Enter') return
        const value = e.target.value
        if(!value.trim()) return
        setTags([...tags, value])
        e.target.value = ''
    }

    function removeTags(index) {
        setTags(tags.filter((el, i) => i !== index))
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

