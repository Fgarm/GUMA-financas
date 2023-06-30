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
} from "@chakra-ui/react";

import axios from "axios";

export default function CreateTag({
  isOpen,
  onClose,
  initialRef,
  finalRef,
  addFlag,
}) {
  const toast = useToast();

  const [createdTag, setCreatedTag] = useState("");
  const [tagColor, setTagColor] = useState("");
  const [inputError, setInputError] = useState("");
  const [corError, setCorError] = useState("");

  const username = localStorage.getItem("cadastro_user");

  function handleCreateTag() {
    const categoria = createdTag;
    const cor = tagColor;
    const user = username;
    const newTag = { categoria, cor, user };
    const tag = newTag;
    console.log(JSON.stringify(tag));
    axios
      .post("http://localhost:8000/tags/criar-tag/", tag)
      .then((response) => {
        console.log(response.data);
        toast({
          title: "Tag criada com sucesso",
          status: "success",
          isClosable: true,
          duration: 3000,
        });
        addFlag();
        onClose();
      })
      .catch((error) => {
        toast({
          title: "Tag já existente",
          status: "error",
          isClosable: true,
          duration: 3000,
        });

        console.log("AQUI");
        console.log(error);
      });
  }

  return (
    <div>
      <Modal
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={onClose}
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader mb={0} className="modal_header">
            Criando Tag
          </ModalHeader>
          <ModalBody>
            <FormControl mt={4}>
              <label>Categoria</label>
              <br></br>
              <Input
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.trim().length > 0) {
                    setCreatedTag(value);
                    setInputError("");
                  } else {
                    setCreatedTag("");
                    setInputError("Este campo é obrigatório.");
                  }
                }}
              />
              {inputError && (
                <Text color="red" fontSize="sm">
                  {inputError}
                </Text>
              )}
            </FormControl>
            <FormControl mt={4}>
              <label>Cor</label>
              <br></br>
              <Input
                placeholder="Ex: 000000"
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.trim().length > 0) {
                    setTagColor(value);
                    setCorError("");
                  } else {
                    setTagColor("");
                    setCorError("Este campo é obrigatório.");
                  }
                }}
              />
              {corError && (
                <Text color="red" fontSize="sm">
                  {corError}
                </Text>
              )}
            </FormControl>
            <span className="hexadecimal">
              Coloque a cor no formato hexadecimal sem a '#'
            </span>
          </ModalBody>
          <ModalFooter>
            <Button
              style={{ background: "#6F9951" }}
              mr={3}
              onClick={() => {
                let hasEmptyFields = false;

                if (createdTag.trim().length === 0) {
                  setInputError("Este campo é obrigatório.");
                  hasEmptyFields = true;
                } else {
                  setInputError("");
                }

                if (tagColor.trim().length === 0) {
                  setCorError("Este campo é obrigatório.");
                  hasEmptyFields = true;
                } else {
                  setCorError("");
                }

                if (!hasEmptyFields) {
                  handleCreateTag();
                }
              }}
            >
              Criar
            </Button>
            <Button
              onClick={() => {
                onClose();
                setInputError("");
                setCorError("");
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
