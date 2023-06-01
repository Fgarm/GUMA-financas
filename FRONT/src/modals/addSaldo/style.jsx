import styled from "styled-components";


export const ContModal = styled.div`
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgb(0,0,0, 0.7);
    z-index: 1000;
`


export const ModalAddSaldo = styled.div`
    margin: auto;
    margin-top: 100px;
    background-color: white;
    width: 450px;
    height: 350px ;
    border-radius: 10px;
    position: relative;

    box-sizing: border-box;
`

export const Close = styled.div`
    border: 2px solid #6F9951;
    position: absolute;
    right: 15px;
    bottom: 15px;
    padding: 10px;
    font-size: 15px;
    border-radius: 10px;
    transition: .3s;

    &:hover{
        background-color: #6F9951;
        color: white;
    }
`

export const ADICIONAR = styled.div`
    border: 2px solid #6F9951;
    position: absolute;
    margin-right: 70px;
    right: 15px;
    bottom: 15px;
    padding: 10px;
    font-size: 15px;
    border-radius: 10px;
    transition: .3s;

    &:hover{
        background-color: #6F9951;
        color: white;
    }
`

export const TitleModal = styled.h1`
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    display: inline-block;
    margin-top: 10px;
    font-weight: bolder;
    
`

export const Saldo = styled.input`
    position: absolute;
    top: 50%;
    left: 50%;
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    width: 250px;
    height: 50px;
`