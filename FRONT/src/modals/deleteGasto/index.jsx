import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";

import { useToast } from "@chakra-ui/react";
import axios from "axios";

export default function DeleteGasto({
  onClose,
  isOpen,
  addFlag,
  cancelRef,
  id,
}) {
  const toast = useToast();
  const token = localStorage.getItem("token");

  function handleDelete() {
    axios
      .delete(`http://localhost:8000/api/gastos/deletar-gasto/`, {
        data: { id: id },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        toast({
          title: "Gasto deletado com sucesso",
          status: "success",
          isClosable: true,
          duration: 3000,
        });
        onClose();
        addFlag();
      })
      .catch((error) => {
        console.error("Erro ao enviar dados:", error);
      });
  }

  return (
    <div>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Deletar Gastos
            </AlertDialogHeader>

            <AlertDialogBody>
              Deseja realmente deletar esse gasto?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancelar
              </Button>

              <Button colorScheme="red" ml={3} onClick={handleDelete}>
                Deletar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </div>
  );
}
