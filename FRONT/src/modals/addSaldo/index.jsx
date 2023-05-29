import { ContModal, ModalAddSaldo, Close, Saldo, TitleModal, ADICIONAR } from "./style"

export default function AddSaldo_modal({isOpen, setIsOpen}){ 
    if (isOpen){
        return(
            <ContModal>
                <ModalAddSaldo>
                    <TitleModal>ADICIONAR SALDO</TitleModal>
                    <Close onClick={setIsOpen}>Close</Close>
                    <Saldo type="number" min="0.00" max="10000.00" step="0.01"></Saldo>
                    <ADICIONAR>ADD</ADICIONAR>
                </ModalAddSaldo>
            </ContModal>
        )
    }else{
        return null
    }
}