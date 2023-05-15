import { useState, useEffect } from "react";
import axios from "axios";

export default function TagsInputSearch(props) {

    const [gastos, setGastos] = useState([]);

    useEffect(() => {
        props.onGastosChange(gastos);
    }, [gastos]);

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

