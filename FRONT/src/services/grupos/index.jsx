import axios from "axios";

export function createGroup(data, toast) {
  axios
    .post("http://localhost:8000/grupos/cadastrar-grupo/", data)
    .then((response) => {
      if (response.status === 201) {
        toast({
          title: "Grupo criado com sucesso.",
          status: "success",
          isClosable: true,
          duration: 3000,
        });
      } else if (response.status === 409) {
        toast({
          title: "Grupo de nome já cadastrado no sistema",
          status: "error",
          isClosable: true,
          duration: 3000,
        });
        // alert("Grupo de nome já cadastrado no sistema");
      } else if (response.status === 400) {
        toast({
          title: "Dados de cadastro não estão nos parâmetros aceitos",
          status: "error",
          isClosable: true,
          duration: 3000,
        });
        // alert("Dados de cadastro não estão nos parâmetros aceitos");
      } else {
        toast({
          title: "Erro de solicitação",
          status: "error",
          isClosable: true,
          duration: 3000,
        });
        // alert("Erro de solicitação");
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

export function getUsuariosGroup(grupo_id) {
  return axios({
    method: "post",
    url: "http://localhost:8000/grupos/usuarios-grupo/",
    data: {
      grupo_id: grupo_id,
    },
  })
    .then((response) => {
      return response.data;
      //   setUsuariosGrupo(response.data)
    })
    .catch((error) => {
      console.log(error);
    });
}
