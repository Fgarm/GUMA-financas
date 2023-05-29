import styled from "styled-components";

export const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 50px;
`

export const Table = styled.table`
    margin: 20px;
    border-collapse: separate;
    border-spacing: 10px;
    color: white;
`
export const Th = styled.th`
    padding: 20px;
    background-color: #005555;
    border-radius: 10px;

`
export const Tr = styled.tr`
    background-color: #049292;

    &:nth-child(even) {background-color: #05c9c9;}
`

export const Td = styled.td`
    text-align: left;
    padding: 5px;
    border-radius: 10px 0  10px 0;
`