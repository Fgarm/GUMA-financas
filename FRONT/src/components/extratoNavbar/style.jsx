import styled from "styled-components";


export const Navbar = styled.nav`

    width: 100%;
    height: 100px;
    background-color: #005555;
    position: relative;
    margin-left: 200px;
`

export const Ul = styled.ul`   
    width: 600px;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 25px;
    list-style: none;
    color: white;
    font-weight: bold;
    position: absolute;
    margin: auto;
    right: 0;
    left: 0;
    bottom: 10px;
`

export const Li = styled.li`
    display: inline;
    margin: 20px;
    transition: .1s;

    &:hover{
        border-bottom-style: solid;
        border-bottom-width: 5px;
    }
`

