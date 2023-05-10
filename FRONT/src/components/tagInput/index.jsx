import { useState } from "react";

export default function TagsInput(props) {
    // console.log(props.tags)
    const [tags, setTags] = useState([])
    const [showError, setShowError] = useState(false);

    const user = props.user
    const cor = 'dad8d8'

    function handleChange(e) {

        const value = e.target.value
        if (!value.trim()) return
        if (tags.some(tag => tag.categoria === value)) {
            e.target.value = '';
            return;
        }

        console.log(value)
        console.log("vazio?")
        const categoria = value

        const newTag = { categoria, cor, user }

        const newTags = [...tags, newTag];
        if (tags.length == 1) {
            e.target.value = '';
            setShowError(true)
            // console.log(tags)
            return
        }
        // setTags(newTags);
        // console.log(tags)
        props.onTagsChange(newTags);
        e.target.value = ''
    }

    function removeTags(index) {
        const newTags = tags.filter((el, i) => i !== index);
        setTags(newTags);
        props.onTagsChange(newTags);
    }

    return (

        <div>
            <div className="tags-input-container">
                {tags.map((tag, index) => (
                    <div className="tags-items" key={index}>
                        <span className="text">{tag.categoria}</span>
                        <span className="close" onClick={() => removeTags(index)}>&times;</span>
                    </div>
                ))}

                <select name="tags" id="tags" className="tags-input" onChange={handleChange}> 
                    
                    {props.tags.length === 0 ? <p></p> :
                     (
                        props.tags.map((tags, key) => (
                            <option value={tags.categoria}>{tags.categoria}</option>
                        ))
                    )}

                </select>

                {showError && (
                    <span className="error-message">Limite de 1 tag atingido.</span>
                )}
            </div>

        </div>
    )
};

