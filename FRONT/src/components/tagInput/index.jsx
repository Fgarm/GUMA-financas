import { useState } from "react";

export default function TagsInput(props) {

    const [tags, setTags] =  useState([])
    const [showError, setShowError] = useState(false);

    function handleChange(e) {
        //if(e.key !== 'Enter') return
        const value = e.target.value
        if(!value.trim()) return
        if (tags.includes(value)){
            e.target.value = ''
            return
        } 
        const newTags = [...tags, value];
        if (tags.length == 4) {
            setShowError(true)
            console.log(tags)
            return
        }
        setTags(newTags);
        console.log(tags)
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

            <select name="tags" id="tags" className="tags-input" onChange={handleChange}>
                <option value="mercado">Mercado</option>
                <option value="luz">Luz</option>
                <option value="agua">Água</option>
                <option value="internet">Internet</option>
                <option value="lazer">Lazer</option>
            </select>

            {/* <input type="text" 
            className="tags-input" 
            placeholder="Digite o tipo de gasto (mercado, carro, ...)" 
            onKeyDown={handleKeyDown}/> */}

            {showError && (
                <span className="error-message">Limite de 4 tags atingido.</span>
            )}
        </div>
    ) 
};

