import React, { useState, useEffect } from "react";
import "./style.css";
import "../../main.css";

import { MdOutlineModeEditOutline, MdDelete } from "react-icons/md";

import { BsFillTagsFill, BsCurrencyDollar } from "react-icons/bs";
import { GiCash } from "react-icons/gi";

import Sidebar from "../../components/sidebar";
import ToggleSearchStatus from "../../components/toggleSearchStatus";

import AddSaldo from "../../modals/addSald";
import CreateTag from "../../modals/createTag";
import CreateGastoUser from "../../modals/createGastoUser";
import EditGasto from "../../modals/editGasto";
import DeleteGasto from "../../modals/deleteGasto";

import ImplementRecurrency from "../../services/implementarRecs";

import formatarData from "../../functions/formatData";
import compareDate from "../../functions/compareDate";

import { Icon, Button, useDisclosure, useToast } from "@chakra-ui/react";

import axios from "axios";

export default function Home() {

  const [flag, setFlag] = useState(0);
  const [id, setId] = useState("");
  const [tags, setTags] = useState([]);
  const [gastos, setGastos] = useState([]);

  const [gastosEntradasPorData, setGastosEntradasPorData] = useState({});
  const [gastosPorDataFiltrados, setGastosPorDataFiltrados] = useState({});
  const [saldo, setSaldo] = useState(0);

  const [shouldRunEffect, setShouldRunEffect] = useState(false);

  const [isFilterOn, setIsFilterOn] = useState(false);

  const [dadosGasto, setDadosGasto] = useState({});

  const [novaTag, setNovaTag] = useState(0);

  const {
    isOpen: isAlertDialogOpen,
    onClose: onAlertDialogClose,
    onOpen: onAlertDialogOpen,
  } = useDisclosure();

  const {
    isOpen: isModalCreateGastoOpen,
    onClose: onModalCreateGastoClose,
    onOpen: onModalCreateGastoOpen,
  } = useDisclosure();

  const {
    isOpen: isModalEditOpen,
    onClose: onModalEditClose,
    onOpen: onModalEditOpen,
  } = useDisclosure();

  const {
    isOpen: isModalTagOpen,
    onClose: onModalTagClose,
    onOpen: onModalTagOpen,
  } = useDisclosure();

  const {
    isOpen: isAddSaldoOpen,
    onClose: onAddSaldoClose,
    onOpen: onAddSaldoOpen,
  } = useDisclosure();

  const cancelRef = React.useRef();

  const username = localStorage.getItem("cadastro_user");
  const token = localStorage.getItem("token");

  function handleAddSaldo() {
    getTags();
    onAddSaldoOpen();
  }

  function handleCreateTag() {
    getTags();
    onModalTagOpen();
  }

  function handleCreateGasto() {
    getTags();
    onModalCreateGastoOpen();
  }

  function handleCloseCreateTag() {
    onModalTagClose();
  }

  function handleCloseAddSaldo() {
    onAddSaldoClose();
  }

  function handleDeleteClick(data) {
    setId(data);
    onAlertDialogOpen();
  }

  function handleCloseCreateGasto() {
    onModalCreateGastoClose();
  }

  function handleCloseEditGasto() {
    setDadosGasto("");
    onModalEditClose();
  }

  function handleCloseAlertDialog() {
    onAlertDialogClose();
  }

  ImplementRecurrency(username);
  
  function extrairData(dataHora) {
    const data = dataHora.split("T")[0];
    return formatarData(data);
  }

  function organizarGastosPorData(params) {
    let gastosData = {};
    params.forEach((gasto) => {
      const data = extrairData(gasto.data);
      if (gastosData[data]) {
        gastosData[data].push(gasto);
      } else {
        gastosData[data] = [gasto];
      }
    });

    const sortedKeys = Object.keys(gastosData).sort(
      (a, b) =>
        new Date(b.split("/").reverse().join("/")) -
        new Date(a.split("/").reverse().join("/"))
    );

    const gastosOrdenado = {};
    sortedKeys.forEach((key) => {
      gastosOrdenado[key] = gastosData[key];
    });

    setGastosPorDataFiltrados(gastosOrdenado); // Atualize o estado aqui
    console.log(gastosPorDataFiltrados);
  }

  function organizarGastosEntradasPorData(params) {
    let gastosPorData = {};
    params.forEach((gasto) => {
      const data = extrairData(gasto.data);
      if (gastosPorData[data]) {
        gastosPorData[data].push(gasto);
      } else {
        gastosPorData[data] = [gasto];
      }
    });

    const sortedKeys = Object.keys(gastosPorData).sort(
      (a, b) =>
        new Date(b.split("/").reverse().join("/")) -
        new Date(a.split("/").reverse().join("/"))
    );

    const gastosPorDataOrdenado = {};
    sortedKeys.forEach((key) => {
      gastosPorDataOrdenado[key] = gastosPorData[key];
    });

    setGastosEntradasPorData(gastosPorDataOrdenado);
  }

  function addFlag() {
    console.log("add flag");
    setFlag((flag) => flag + 1);
  }

  function getGastosEntrada() {
    axios
      .post("http://localhost:8000/bancario/extrato-saldo/", {
        username: username,
      })
      .then((response) => {
        organizarGastosEntradasPorData(response.data);
      })
      .catch((error) => {
        console.log("user", username);
        console.error("Erro ao enviar dados:", error);
      });
  }

  function getSaldos() {
    axios
      .post("http://localhost:8000/bancario/saldo-atual/", {
        username: username,
      })
      .then((response) => {
        setSaldo(response.data);
      })
      .catch((error) => {
        console.error("Erro ao enviar dados:", error);
      });
  }

  const getGastos = () => {
    axios({
      method: "post",
      url: "http://localhost:8000/api/gastos/obter-gasto/",
      data: {
        user: username,
      },
    })
      .then((response) => {
        const data = response.data;
        setGastos(data);
        organizarGastosPorData(data);
        setShouldRunEffect(true);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getTags = () => {
    axios({
      method: "post",
      url: "http://localhost:8000/tags/tag-per-user/",
      data: {
        user: username,
      },
    })
      .then((response) => {
        setTags(response.data);
        console.log(tags);
        setShouldRunEffect(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  function handleEditClick(gasto) {
    setDadosGasto(gasto);
    getTags();
    onModalEditOpen();
  }

  useEffect(() => {
    ImplementRecurrency(username);
    getGastos();
    getGastosEntrada();
    getSaldos();
  }, [flag]);

  useEffect(() => {
    organizarGastosPorData(gastos);
  }, [gastos]);

  return (
    <>
      <Sidebar user={username} />
      <div className="body">
        <header className="home">
          <h1 className="page-title">Meu Extrato</h1>
          <div className="bt-sb">
            <ToggleSearchStatus
              flag={flag}
              novaTag={novaTag}
              user={username}
              onGastosChange={setGastos}
              filterOn={setIsFilterOn}
            />
            <div className="new-tag-and-gasto-button-container">
              <Button
                className="new-tag-and-gasto-button"
                onClick={handleAddSaldo}
              >
                {" "}
                <Icon
                  style={{ marginLeft: "-1px", marginRight: "9px" }}
                  as={GiCash}
                  w={6}
                  h={5}
                />
                Nova Entrada
              </Button>

              <Button
                className="new-tag-and-gasto-button"
                pr="10px"
                onClick={handleCreateGasto}
              >
                <Icon
                  style={{ marginLeft: "-1px", marginRight: "9px" }}
                  as={BsCurrencyDollar}
                  w={6}
                  h={5}
                />
                Novo Gasto
              </Button>

              <Button
                className="new-tag-and-gasto-button"
                pr="10px"
                onClick={handleCreateTag}
              >
                <Icon
                  style={{ marginLeft: "-10px", marginRight: "10px" }}
                  as={BsFillTagsFill}
                  w={5}
                  h={5}
                />
                Nova Tag
              </Button>
            </div>
          </div>
        </header>

        <div className="add-entrada">
          <div className="saldo-information">R$ {saldo}</div>
        </div>

        <div>
          <DeleteGasto
            isOpen={isAlertDialogOpen}
            onClose={onAlertDialogClose}
            cancelRef={cancelRef}
            id={id}
            addFlag={addFlag}
          >
            <Button onClick={handleCloseAlertDialog}>Fechar</Button>
          </DeleteGasto>
        </div>

        <div>
          <AddSaldo
            isOpen={isAddSaldoOpen}
            onClose={onAddSaldoClose}
            user={username}
            addFlag={addFlag}
          >
            <Button onClick={handleCloseAddSaldo}>Fechar</Button>
          </AddSaldo>
        </div>

        <div>
          <CreateGastoUser
            isOpen={isModalCreateGastoOpen}
            onClose={onModalCreateGastoClose}
            user={username}
            addFlag={addFlag}
            tags={tags}
          >
            <Button onClick={handleCloseCreateGasto}>Fechar</Button>
          </CreateGastoUser>
        </div>

        <div>
          <CreateTag
            isOpen={isModalTagOpen}
            onClose={onModalTagClose}
            user={username}
            addFlag={addFlag}
          >
            <Button onClick={handleCloseCreateTag}>Fechar</Button>
          </CreateTag>
        </div>

        <div>
          <EditGasto
            isOpen={isModalEditOpen}
            onClose={onModalEditClose}
            dados={dadosGasto}
            addFlag={addFlag}
            tags={tags}
          >
            <Button onClick={handleCloseEditGasto}>Fechar</Button>
          </EditGasto>
        </div>

        <div className="gasto">
          {isFilterOn == false ? (
            Object.entries(gastosEntradasPorData).length === 0 ? (
              <p>Não há gastos com os parâmetros especificados</p>
            ) : (
              Object.entries(gastosEntradasPorData).map(([data, gastos]) => (
                <div key={data}>
                  {compareDate(data) === true ? (
                    <h4 className="dia_gasto">Hoje</h4>
                  ) : (
                    <h3 className="dia_gasto">{data}</h3>
                  )}
                  {gastos.map((gasto, key) => (
                    <div key={gasto.id} className="gasto_information">
                      <p>{gasto.nome}</p>
                      <p>
                        {gasto.valor > 0 ? (
                          <p style={{ color: "#6F9951", fontWeight: "bold" }}>
                            + R$ {gasto.valor}{" "}
                          </p>
                        ) : (
                          <p style={{ color: "red", fontWeight: "bold" }}>
                            - R$ {gasto.valor * -1}{" "}
                          </p>
                        )}
                      </p>
                      <p>
                        {gasto.pago == null ? (
                          ""
                        ) : gasto.pago > 0 ? (
                          <p style={{ color: "#6F9951", fontWeight: "bold" }}>
                            Pago
                          </p>
                        ) : (
                          <p style={{ color: "red", fontWeight: "bold" }}>
                            Não Pago
                          </p>
                        )}
                      </p>
                      <p>{gasto.tag}</p>
                      <div>
                        {gasto.valor < 0 && (
                          <>
                            <Icon
                              className="edit-icon-gasto"
                              as={MdOutlineModeEditOutline}
                              color="whiteAlpha.500"
                              w={5}
                              h={5}
                              mr={2}
                              onClick={() => handleEditClick(gasto)}
                            />

                            <Icon
                              className="delete-icon-gasto"
                              as={MdDelete}
                              color="red.500"
                              w={5}
                              h={5}
                              onClick={() => handleDeleteClick(gasto.id)}
                            />
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))
            )
          ) : Object.entries(gastosPorDataFiltrados).length === 0 ? (
            <p>Não há gastos com os parâmetros especificados</p>
          ) : (
            Object.entries(gastosPorDataFiltrados).map(([data, gastos]) => (
              <div key={data}>
                {compareDate(data) === true ? (
                  <h4 className="dia_gasto">Hoje</h4>
                ) : (
                  <h3 className="dia_gasto">{data}</h3>
                )}
                {gastos.map((gasto, key) => (
                  <div key={gasto.id} className="gasto_information">
                    <p>{gasto.nome}</p>

                    <p style={{ color: "red", fontWeight: "bold" }}>
                      -R$ {gasto.valor}
                    </p>

                    <p>
                      {gasto.pago == null ? (
                        ""
                      ) : gasto.pago > 0 ? (
                        <p style={{ color: "darkgreen", fontWeight: "bold" }}>
                          Pago
                        </p>
                      ) : (
                        <p style={{ color: "red", fontWeight: "bold" }}>
                          Não Pago
                        </p>
                      )}
                    </p>
                    <p>{gasto.tag}</p>
                    <div>
                      {gasto.valor < 0 && (
                        <>
                          <Icon
                            className="edit-icon-gasto"
                            as={MdOutlineModeEditOutline}
                            w={5}
                            h={5}
                            mr={2}
                            onClick={() => handleEditClick(gasto)}
                          />
                          <Icon
                            className="delete-icon-gasto"
                            as={MdDelete}
                            color="red.500"
                            w={5}
                            h={5}
                            onClick={() => handleDeleteClick(gasto.id)}
                          />
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
