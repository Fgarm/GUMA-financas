import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.css';

export default function ToggleSearchStatus(props) {

  const username = props.user;

  const [selectedOption, setSelectedOption] = useState("todos");
  const [tags, setTags] = useState([]);
  const [gastos, setGastos] = useState([]);
  const [tagsSearch, setTagsSearch] = useState('todas');
  //const [search, setSearch] = useState();
  const search = selectedOption === "pagos" ? true : false;
  useEffect(() => {
    props.onGastosChange(gastos);
  }, [gastos]);
  
  useEffect(() => {  
    getTags();
  }, [props.novaTag, props.flag]);

  useEffect(() => {
    handleSearch()
  }, [tagsSearch, selectedOption])

  const getGastos = () => {
    axios({
      method: "post",
      url: "http://localhost:8000/api/gastos/obter-gasto/",
      data: {
        user: username
      },
    })
      .then((response) => {
        if (response.status == 200) {
          const data = response.data;
          setGastos(data);
        } else {
          setGastos([]);
        }
      })
      .catch(error => {
        console.log(error);
      })
    }
    
    function getGastosPerStatus(status){
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
        setGastos([]);
        console.log(error);
      })
    }
    
    function getGastosPerTag(value) {
      axios({
        method: "post",
        url: "http://localhost:8000/api/gastos/gastos-per-tag/",
        data: {
          user: username,
          tag: value
          },
        })
          .then((response) => {
            const data = response.data;
            setGastos(data);
          })
          .catch(error => {
            setGastos([]);
            console.log(error);
          })
    }

  function handleSearch() {

    console.log(tagsSearch, selectedOption)
    if (tagsSearch === "todas" && selectedOption === "todos") {
      getGastos();
      props.filterOn(false);
    } else if (tagsSearch === "todas" && selectedOption === "pagos") {
        getGastosPerStatus(true);
        props.filterOn(true);
    } else if (tagsSearch === "todas" && selectedOption === "naoPagos") {
      getGastosPerStatus(false);
      props.filterOn(true);
    } else if (tagsSearch !== "todas" && selectedOption === "todos") {
      getGastosPerTag(tagsSearch);
      props.filterOn(true);
    } else if (tagsSearch !== "todas" && selectedOption !== "todas") {
      // if (selectedOption == "pagos") {
      //   setSearch(false);
      // } else if (selectedOption == "naoPagos"){
      //   setSearch(true);
      // }

      axios({
        method: "post",
        url: "http://localhost:8000/api/gastos/gastos-per-tag-por-pago/",
        data: {
          user: username,
          pago: search,
          tag: tagsSearch
        },
      })
        .then((response) => {
          // if (response.status == 200) {
            const data = response.data;
            setGastos(data);
            props.filterOn(true);
          // }
        })
        .catch(error => {
          setGastos([]);
          console.log(error);
        })
    }
  }

  const getTags = () => {
    axios({
      method: "post",
      url: "http://localhost:8000/tags/tag-per-user/",
      data: {
        user: username
      },
    })
      .then((response) => { 
        setTags(response.data);
      })
      .catch(error => {
        console.log(error);
      })
  }

  const handleOptionClick = (value) => {
    setSelectedOption(value);
  };

  function handleChangeTags(e) {
    setTagsSearch(e.target.value); 
  }

    return (

      <div  className='flex-search'>
        <div className="tags-input-search-container">

          <select name="tags" id="tags" className="tags-input-search" onChange={handleChangeTags} value={props.editado}> 
              
              <option value="todas">Todas as tags</option>

              {tags.length === 0 ? <p></p> :
               (
                  tags.map((tags, key) => (
                      <option value={tags.categoria}>{tags.categoria}</option>
                  ))
              )}

          </select>

        </div>

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
    </div>
    )
}
