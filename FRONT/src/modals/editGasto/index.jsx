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
  Select,
} from "@chakra-ui/react";


import TagsInput from "../../components/tagInput";

import usaFormat from "../../functions/usaFormat";

import axios from "axios";
import { add } from "lodash";

export default function EditGasto({
  isOpen,
  onClose,
  initialRef,
  finalRef,
  addFlag,
  tags,
  dados,
}) {

  const username = localStorage.getItem('cadastro_user')
  const token = localStorage.getItem('token')

  function handleTagsChange(newTag) {
    console.log("TAGS-NT", newTag)
    setTagsList(newTag);
  }

  useEffect(() => {
    
    setNome(dados.nome);
    setValor(dados.valor * -1);

    if (dados && dados.data) {
      setSelectedDate(usaFormat(dados.data));
    } 
    
    setEditTags(dados.tag);
    console.log("SSSSSS", editTags)
    setTagsList(dados.tag);
    if (dados.pago == true) {
      setEditStatus('pago')
      setPago(true)
    } else if (dados.pago == false) {
      setEditStatus('nao-pago')
      setPago(false)
    }
    setId(dados.id);
  }, [dados, tags]);

  
  const [nome, setNome] = useState("");
  const [valor, setValor] = useState("");
  const [data, setSelectedDate] = useState("");
  const [pago, setPago] = useState(false);
  const [tagsList, setTagsList] = useState({});
  const [nomeError, setNomeError] = useState(null);
  const [valorError, setValorError] = useState(null);
  const [dataError, setDataError] = useState(null);
  const [editStatus, setEditStatus] = useState("");
  const [editTags, setEditTags] = useState("");
  const [id, setId] = useState();

  function handleClearInput() {
    setNome('');
    setValor(0);
    setPago(false);
    setSelectedDate('');
  }

  function handleClearErros() {
    setNomeError('');
    setValorError('');
    setDataError('');
  }

  const handleEdit = () => {
    const tag_edit = tagsList;

    if (tag_edit.categoria == null) {
      if (editTags == null) {
        tag_edit.category = "";
      } else {
        tag_edit.category = editTags;
      }
    }

    if (valor < 0) {
      setValor(valor * -1);
    }

    axios
      .put(
        "http://localhost:8000/api/gastos/atualizar-gasto/",
        {
          user: username,
          id: id,
          nome: nome,
          valor: valor,
          data: data,
          pago: pago,
          tag: tag_edit.categoria,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        if (response.status == 204) {
          console.log("Gasto atualizado com sucesso");
          onClose();
          handleClearInput();
          addFlag();
        } else {
          alert("Erro ao atualizar gasto");
        }
      })
      .catch((error) => {
        console.error("Erro ao enviar dados:", error);
      });
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
            Editando Gasto
          </ModalHeader>
          <ModalBody>
            <FormControl mt={4}>
              <label>Nome</label>
              <br></br>
              <Input
                value={nome}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.trim().length > 0) {
                    setNome(value);
                    setNomeError(null);
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
                value={data}
                type="date"
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.trim().length > 0) {
                    setSelectedDate(value);
                    setDataError(null);
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
              <label>Status</label>
              <br></br>
              <Select
                value={editStatus}
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
                editado={dados.tag}
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
                  setNomeError(null);
                }

                if (valor == 0) {
                  setValorError("Este campo é obrigatório.");
                  hasEmptyFields = true;
                } else {
                  setValorError(null);
                }

                if (data.trim().length === 0) {
                  setDataError("Este campo é obrigatório.");
                  hasEmptyFields = true;
                } else {
                  setDataError(null);
                }

                if (!hasEmptyFields) {
                  handleEdit();
                }
              }}
            >
              Salvar
            </Button>
            <Button
              onClick={() => {
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
