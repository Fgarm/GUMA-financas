import axios from "axios";

export function ImplementRecurrency(username) {
  console.log("implementando recorrencias");

  const dado = {
    user: username,
  };

  axios
    .post("http://127.0.0.1:8000/recorrencia/implementar-recorrencias/", dado)
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
}

export function GetSaldos(username) {
  return axios
    .post("http://localhost:8000/bancario/saldo-atual/", {
      username: username,
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Erro ao enviar dados:", error);
    });
}

export function GetGastosEntrada(username) {
  return axios
    .post("http://localhost:8000/bancario/extrato-saldo/", {
      username: username,
    })
    .then((response) => {
      return response.data;
      // organizarGastosEntradasPorData(response.data);
    })
    .catch((error) => {
      console.log("user", username);
      console.error("Erro ao enviar dados:", error);
    });
}

export function GetGastos(username) {
  return axios({
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
    })
    .catch((error) => {
      console.log(error);
    });
}
