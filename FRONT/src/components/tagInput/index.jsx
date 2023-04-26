import { useState } from "react";
import { Button } from "@chakra-ui/react";

export default function TagsInput(props) {

    const [tags, setTags] =  useState([])
    const [showError, setShowError] = useState(false);
    const [createdTag, setCreatedTag] = useState('')

    const user = props.user
    const cor = '#dad8d8'

    function handleChange(e) {
        //if(e.key !== 'Enter') return
        const value = e.target.value
        if(!value.trim()) return
        if (tags.some(tag => tag.categoria === value)) {
            e.target.value = '';
            return;
        }
    
        const categoria = value

        const newTag = {categoria, cor, user}

        const newTags = [...tags, newTag];
        if (tags.length == 4) {
            e.target.value = '';
            setShowError(true)
            console.log(tags)
            return
        }
        setTags(newTags);
        props.onTagsChange(newTags);
        e.target.value = ''
    }

    function removeTags(index) {
        const newTags = tags.filter((el, i) => i !== index);
        setTags(newTags);
        props.onTagsChange(newTags);
    }

    function handleCreateTag(){

        if(!createdTag.trim()) return
        if (tags.some(tag => tag.categoria === createdTag)) {
            setCreatedTag('');
            return;
        }
    
        const categoria = createdTag

        const newTag = {categoria, cor, user}

        const newTags = [...tags, newTag];
        if (tags.length == 4) {
            setCreatedTag('')
            setShowError(true)
            console.log(tags)
            return
        }
        setTags(newTags);
        props.onTagsChange(newTags);
        setCreatedTag('')
    }

    return(

    <div>
        <div className="tags-input-container">
            {tags.map((tag, index) => (
                <div className="tags-items" key={index}>
                    <span className="text">{tag.categoria}</span>
                    <span className="close" onClick={() => removeTags(index)}>&times;</span>
                </div>
            ))}

            <select name="tags" id="tags" className="tags-input" onChange={handleChange}>
                <option value="">Selecione suas tags</option>
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

        <div className="create-tag">
            <input type="text" placeholder="Digite uma nova tag" value={createdTag} onChange={(e) => {
                setCreatedTag(e.target.value);
            }}/>
            <Button size='xs' colorScheme="blue" mt={2} onClick={handleCreateTag}>Adicionar Tags</Button>
        </div>

    </div>
    ) 
};

