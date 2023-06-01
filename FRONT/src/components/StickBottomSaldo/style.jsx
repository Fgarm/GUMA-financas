import styled from "styled-components";

export const ContainerBotton = styled.div`
  
`

export const Button = styled.button`

    border: 2px solid #6F9951; 
    border-radius: 5px;
    padding: 10px;
    font-weight: bolder;
    font-size: 25px;
    transition-duration: 0.4s;
    position: fixed;
    bottom: 50px;
    right: 50px;
    color: white;

    


    &:hover {
        background-color: #6F9951; 
        box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19);
        color: white;
    }
    
`