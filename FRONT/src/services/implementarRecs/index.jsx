import axios from "axios";

export default function ImplementRecurrency(username) {
    console.log("implementando recorrencias");

    const dado = {
      user: username,
    };

    console.log(dado);

    axios
      .post("http://127.0.0.1:8000/recorrencia/implementar-recorrencias/", dado)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
