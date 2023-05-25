import { useState, useEffect } from "react";
import axios from "axios";

export default function TagsInputSearch(props) {

    const [gastos, setGastos] = useState([]);
    const[tags, setTags] = useState([])

    useEffect(() => {
        props.onGastosChange(gastos);
    }, [gastos]);


    useEffect(() => {  
        getTags();
    }, []);
        

    const user = props.user

    const getGastos = () => {
        axios({
          method: "post",
          url: "http://localhost:8000/api/gastos/obter-gasto/",
          data: {
            user: user
          },
        })
          .then((response) => {
            const data = response.data;
            setGastos(data);
          })
          .catch(error => {
            console.log(error);
          })
      }

      const getTags = () => {
        axios({
          method: "post",
          url: "http://localhost:8000/tags/tag-per-user/",
          data: {
            user: user
          },
        })
          .then((response) => { 
            setTags(response.data);
            console.log(tags)
          })
          .catch(error => {
            console.log(error);
          })
      }

    function handleChange(e) {

        const value = e.target.value
        if (value === "todas") {
            getGastos();
        } else {
            axios({
                method: "post",
                url: "http://localhost:8000/api/gastos/gastos-per-tag/",
                data: {
                    user: user,
                    tag: value
                },
            })
                .then((response) => {
                const data = response.data;
                setGastos(data);
                })
                .catch(error => {
                console.log(error);
                })
    }

}


    return (

        <div>
            <div className="tags-input-search-container">

                <select name="tags" id="tags" className="tags-input-search" onChange={handleChange} value={props.editado}> 
                    
                    <option value="todas">Todas as tags</option>

                    {tags.length === 0 ? <p></p> :
                     (
                        tags.map((tags, key) => (
                            <option value={tags.categoria}>{tags.categoria}</option>
                        ))
                    )}

                </select>

            </div>

        </div>
    )
};

