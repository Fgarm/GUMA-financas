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
      // const data = response.data;
      // setGastos(data);
      // organizarGastosPorData(data);
      return response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

export function GetTags(username){
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
};

export function LogInFunc(data, toast, navigate){
  axios.post('http://localhost:8000/auth/login/', data)
    .then(response => {
      if (response.status === 200 && response.data.access) {
        localStorage.setItem('cadastro_user', data.username)
        localStorage.setItem('token', response.data.token)
        navigate('/home', { replace: true })
      } else {
        toast({
          title: 'Usuário ou senha incorretos',
          status: 'error',
          isClosable: true,
          duration: 3000,
        })
      }
    })
    .catch(error => {
      console.log(error)
    })
}

export function LogUpFunc(data, toast, navigate){
  axios.post('http://localhost:8000/auth/cadastro/', data)
    .then(response => {
      if (response.status === 200) {
        toast({
          title: 'Usuário cadastrado com sucesso.',
          status: 'success',
          isClosable: true,
          duration: 3000,
        });
        navigate('/', { replace: true });
      }
    })
    .catch(error => {
      if (error.response) {
        const statusCode = parseInt(error.response.status);
        if (statusCode === 409) {
          toast({
            title: 'Usuário ou email já cadastrados no sistema',
            status: 'error',
            isClosable: true,
            duration: 3000,
          });
        } else if (statusCode === 400) {
          toast({
            title: 'Dados de cadastro não estão nos parâmetros aceitos',
            status: 'error',
            isClosable: true,
            duration: 3000,
          });
        } 
      } else {
        console.log("Erro de solicitação:", error.message);
      }
    });
}
