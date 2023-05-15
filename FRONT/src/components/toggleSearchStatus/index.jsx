import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ToggleSearchStatus(props) {

    const username = props.user;

    const [selectedOption, setSelectedOption] = useState("todos");

    const [gastos, setGastos] = useState([]);

    useEffect(() => {
        props.onGastosChange(gastos);
      }, [gastos]);

      const getGastos = () => {
        axios({
          method: "post",
          url: "http://localhost:8000/api/gastos/obter-gasto/",
          data: {
            user: username
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
    

    const searchFilter = (status) => {
          axios({
            method: "post",
            url: "http://localhost:8000/api/gastos/filtrar-por-pago/",
            data: {
              user: username,
              pago: status
            },
          })
            .then((response) => {
              if (response.status == 200) {
                const data = response.data;
                setGastos(data);
              }
            })
            .catch(error => {
              console.log(error);
            })
        }

    const handleOptionClick = (value) => {
        setSelectedOption(value);

        if (value === "pagos") {
            searchFilter(true);
        } else if (value === "naoPagos") {
            searchFilter(false);
            // props.onGastosChange(gastos);
        } else {
            getGastos();
        }
    };

    return (
        <div class="customCheckBoxHolder">
            <input 
            class="customCheckBoxInput" 
            id="cCB1" 
            type="checkbox" 
            checked={selectedOption === "todos"}
            onChange={() => handleOptionClick("todos")}
            />
            
            <label class="customCheckBoxWrapper" for="cCB1">
                <div class="customCheckBox">
                    <div class="inner">Todos</div>
                </div>
            </label>

            <input 
            class="customCheckBoxInput" 
            id="cCB2" 
            type="checkbox" 
            name="checkboxOptions"
            checked={selectedOption === "pagos"}
            onChange={() => handleOptionClick("pagos")}
            />

            <label class="customCheckBoxWrapper" for="cCB2">
                <div class="customCheckBox">
                    <div class="inner">Pagos</div>
                </div>
            </label>

            <input 
            class="customCheckBoxInput" 
            id="cCB3" 
            type="checkbox" 
            name="checkboxOptions"
            checked={selectedOption === "naoPagos"}
            onChange={() => handleOptionClick("naoPagos")}
            />
            <label class="customCheckBoxWrapper" for="cCB3">
                <div class="customCheckBox">
                    <div class="inner">Não Pagos</div>
                </div>
            </label>
        </div>
    )
}
