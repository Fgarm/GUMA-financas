import axios from "axios";

export function ImplementRecurrency(username) {
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
      // const data = response.data;
      // setGastos(data);
      // organizarGastosPorData(data);
      return response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

export function GetGastosPerTag(username, value) {
  return axios({
    method: "post",
    url: "http://localhost:8000/api/gastos/gastos-per-tag/",
    data: {
      user: username,
      tag: value
      },
    })
      .then((response) => {
        return response.data;
        // const data = response.data;
        // setGastos(data);
      })
      .catch(error => {
        return [];
        // setGastos([]);
        console.log(error);
      })
}

export function GetGastosPerStatus(username, status){
  return axios({
    method: "post",
    url: "http://localhost:8000/api/gastos/filtrar-por-pago/",
    data: {
    user: username,
      pago: status
    },
  })
  .then((response) => {
    if (response.status == 200) {
      return response.data;
      // const data = response.data;
      // setGastos(data);
    }
  })
  .catch(error => {
    return [];
    // setGastos([]);
    console.log(error);
  })
}

export function GetTags(username) {
  return axios({
    method: "post",
    url: "http://localhost:8000/tags/tag-per-user/",
    data: {
      user: username,
    },
  })
    .then((response) => {
      // setTags(response.data);
      // console.log(tags);
      return response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

export function LogInFunc(data, toast, navigate) {
  axios
    .post("http://localhost:8000/auth/login/", data)
    .then((response) => {
      if (response.status === 200 && response.data.access) {
        localStorage.setItem("cadastro_user", data.username);
        localStorage.setItem("token", response.data.token);
        navigate("/home", { replace: true });
      } else {
        toast({
          title: "Usuário ou senha incorretos",
          status: "error",
          isClosable: true,
          duration: 3000,
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

export function LogUpFunc(data, toast, navigate) {
  axios
    .post("http://localhost:8000/auth/cadastro/", data)
    .then((response) => {
      if (response.status === 200) {
        toast({
          title: "Usuário cadastrado com sucesso.",
          status: "success",
          isClosable: true,
          duration: 3000,
        });
        navigate("/", { replace: true });
      }
    })
    .catch((error) => {
      if (error.response) {
        const statusCode = parseInt(error.response.status);
        if (statusCode === 409) {
          toast({
            title: "Usuário ou email já cadastrados no sistema",
            status: "error",
            isClosable: true,
            duration: 3000,
          });
        } else if (statusCode === 400) {
          toast({
            title: "Dados de cadastro não estão nos parâmetros aceitos",
            status: "error",
            isClosable: true,
            duration: 3000,
          });
        }
      } else {
        console.log("Erro de solicitação:", error.message);
      }
    });
}

export function GetRecorrencias(username) {
  return axios
    .post("http://127.0.0.1:8000/recorrencia/get-recorrencias/", {
      user: username,
    })
    .then((response) => {
      // setRecorrencias(response.data)
      // console.log(response.data)
      return response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

export function handleDeleteRec(id, toast, addFlag) {
  axios
    .delete("http://127.0.0.1:8000/recorrencia/apagar-recorrencia/", {
      data: { id: id },
    })
    .then((response) => {
      if (response.status === 204) {
        addFlag();
        toast({
          title: "Recorrência apagada com sucesso.",
          status: "success",
          isClosable: true,
          duration: 3000,
        });
      } else {
        toast({
          title: "Erro ao apagar recorrência.",
          status: "error",
          isClosable: true,
          duration: 3000,
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

export function CreateGasto(dados, periodicidade, toast) {
  if (periodicidade == false) {
    axios
      .post("http://localhost:8000/api/gastos/criar-gasto/", dados)
      .then((response) => {
        if (response.status == 201) {
          console.log(response.data);
          toast({
            title: "Gasto criado com sucesso",
            status: "success",
            isClosable: true,
            duration: 3000,
          });
        } else {
          toast({
            title: "Erro ao criar gasto.",
            status: "error",
            isClosable: true,
            duration: 3000,
          });
          return;
        }
      })
      .catch((error) => {
        console.error("Erro ao enviar dados:", error);
      });
  } else {
    console.log(JSON.stringify(dados));
    axios
      .post("http://127.0.0.1:8000/recorrencia/criar-recorrencias/", dados)
      .then((response) => {
        if (response.status == 200 || response.status == 201) {
          setHasPeridiocity(false);
          console.log("Dados enviados com sucesso:", response.data);
          toast({
            title: "Gasto criado com sucesso",
            status: "success",
            isClosable: true,
            duration: 3000,
          });
        } else {
          toast({
            title: "Erro ao criar gasto.",
            status: "error",
            isClosable: true,
            duration: 3000,
          });
          return;
        }
      });
  }
}
