import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  FormControl,
  Input,
  Button,
  ModalHeader,
  useToast,
  Text,
  Checkbox,
  Select
} from "@chakra-ui/react";

import axios from "axios";

import TagsInput from "../../components/tagInput";
import { add } from "lodash";

export default function CreateGastoUser({
  isOpen,
  onClose,
  initialRef,
  finalRef,
  addFlag,
  tags,
}) {
  const toast = useToast();

  const [nome, setNome] = useState("");
  const [valor, setValor] = useState("");
  const [data, setSelectedDate] = useState("");
  const [pago, setPago] = useState("");
  const [tagsList, setTagsList] = useState({});

  const [hasPeridiocity, setHasPeridiocity] = useState(false);
  const [periodicity, setPeriodicity] = useState("");

  const [nomeError, setNomeError] = useState("");
  const [valorError, setValorError] = useState("");
  const [dataError, setDataError] = useState('')


  const username = localStorage.getItem("cadastro_user");
  const token = localStorage.getItem('token')


  function handleTagsChange(newTag) {
    setTagsList(newTag);
  }

  function handleClearInput() {
    setNome('');
    setValor(0);
    setPago(false);
    setSelectedDate('');
    setHasPeridiocity(false);
  }

  const handleSubmit = () => {
    const tag_submit = tagsList;

    const dados = {
      nome,
      valor,
      data,
      pago,
      tag: tag_submit.categoria,
      user: username,
    };

    const dados_periodicos = {
      frequencia: periodicity,
      user: username,
      data,
      nome,
      tipo: "gasto",
      pago,
      valor,
      tag: tag_submit.categoria,
    };

    console.log(JSON.stringify(dados));

    if (hasPeridiocity == false) {
      axios
        .post("http://localhost:8000/api/gastos/criar-gasto/", dados, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
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
            alert("Erro de dados submetidos");
            return;
          }
          onClose();
          handleClearInput();
          addFlag();
        })
        .catch((error) => {
          console.error("Erro ao enviar dados:", error);
        });
    } else {
      console.log(JSON.stringify(dados_periodicos));
      axios
        .post(
          "http://127.0.0.1:8000/recorrencia/criar-recorrencias/",
          dados_periodicos
        )
        .then((response) => {
          if (response.status == 200 || response.status == 201) {
            setHasPeridiocity(false);
            console.log("Dados enviados com sucesso:", response.data);
          } else {
            alert("Erro de dados submetidos");
            return;
          }
          onClose();
          addFlag();
        });
    }
  };

  return (
    <div>
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader mb={0} className="modal_header">
            Criando Gasto
          </ModalHeader>
          <ModalBody>
            <FormControl mt={4}>
              <label>Nome</label>
              <br></br>
              <Input
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.trim().length > 0) {
                    setNome(value);
                    setNomeError("");
                  } else {
                    setNome("");
                    setNomeError("Este campo é obrigatório.");
                  }
                }}
              />
              {nomeError && (
                <Text color="red" fontSize="sm">
                  {nomeError}
                </Text>
              )}
            </FormControl>
            <FormControl mt={4}>
              <label>Valor</label>
              <br></br>

              <Input
                value={`R$ ${
                  valor.toLocaleString("pt-BR", {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                  }) || ""
                }`}
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/\D/g, "");
                  const floatValue = parseFloat(rawValue) / 100;

                  if (rawValue.length > 0) {
                    setValor(floatValue);
                    setValorError("");
                  } else {
                    setValor(0);
                    setValorError("Este campo é obrigatório.");
                  }
                }}
              />

              {valorError && (
                <Text color="red" fontSize="sm">
                  {valorError}
                </Text>
              )}
            </FormControl>
            <FormControl mt={4}>
              <label>Data</label>
              <br></br>
              <Input
                type="date"
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.trim().length > 0) {
                    setSelectedDate(value);
                    setDataError("");
                  } else {
                    setSelectedDate("");
                    setDataError("Este campo é obrigatório.");
                  }
                }}
              />
              {dataError && (
                <Text color="red" fontSize="sm">
                  {dataError}
                </Text>
              )}
            </FormControl>
            <FormControl mt={4}>
              <Checkbox
                className="checkbox-peridiocity"
                onChange={(e) => setHasPeridiocity(e.target.checked)}
              >
                O gasto é periódico?
              </Checkbox>
            </FormControl>

            {hasPeridiocity ? (
              <FormControl mt={4}>
                <label>Peridiocidade</label>
                <br></br>
                <Select
                  placeholder="Selecione uma opção"
                  onChange={(e) => {
                    if (e.target.value == "diario") {
                      setPeriodicity("Diario");
                    } else if (e.target.value == "semanal") {
                      setPeriodicity("Semanal");
                    } else if (e.target.value == "mensal") {
                      setPeriodicity("Mensal");
                    } else if (e.target.value == "anual") {
                      setPeriodicity("Anual");
                    }
                  }}
                >
                  <option value="diario">Diário</option>
                  <option value="semanal">Semanal</option>
                  <option value="mensal">Mensal</option>
                  <option value="anual">Anual</option>
                </Select>
              </FormControl>
            ) : (
              <></>
            )}

            <FormControl mt={4}>
              <label>Status</label>
              <br></br>
              <Select
                placeholder="Selecione uma opção"
                onChange={(e) => {
                  if (e.target.value == "pago") {
                    setPago(true);
                  } else if (e.target.value == "nao-pago") {
                    setPago(false);
                  }
                }}
              >
                <option value="pago">Pago</option>
                <option value="nao-pago">Não Pago</option>
              </Select>
            </FormControl>
            <FormControl mt={4}>
              <label>Tags</label>
              <br></br>
              <TagsInput
                tags={tags}
                onTagsChange={handleTagsChange}
                user={username}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              style={{ background: "#6F9951" }}
              mr={3}
              onClick={() => {
                let hasEmptyFields = false;

                if (nome.trim().length === 0) {
                  setNomeError("Este campo é obrigatório.");
                  hasEmptyFields = true;
                } else {
                  setNomeError("");
                }

                if (valor == 0) {
                  setValorError("Este campo é obrigatório.");
                  hasEmptyFields = true;
                } else {
                  setValorError("");
                }

                if (data.trim().length === 0) {
                  setDataError("Este campo é obrigatório.");
                  hasEmptyFields = true;
                } else {
                  setDataError("");
                }

                if (!hasEmptyFields) {
                  handleSubmit();
                }
              }}
            >
              Criar
            </Button>

            <Button
              onClick={() => {
                setHasPeridiocity(false);
                handleClearInput();
                handleClearErros();
                onClose();
              }}
            >
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
