import axios from "axios"
import React from "react"
import { Container ,Table, Th, Tr, Td } from "./style";

const BaseUrl = "http://127.0.0.1:8000/bancario/extrato-saldo/"

export default function SaldoBlock(){
    const [post, setPost] = React.useState(null);
    const username = localStorage.getItem('cadastro_user')

    const getPost = async () => {
        await axios.post(BaseUrl, {
            username: username
        }).then(response => {
            setPost(response.data)
        });
    }
    
    
    React.useEffect(() => {
        getPost();
    }, [])
    
    if (!post) return "no post"
    
    
    return(
        
        <Container>
            <Table>

                    <Tr>
                        <Th>DATA</Th>
                        <Th>Hora</Th>
                        <Th>VAlOR</Th>
                        <Th>SALDO</Th>
                    </Tr>
                {

                    post.map((e) => (
                       
                       <Tr>
                            <Td>{e.data.split("T1")[0]}</Td>
                            <Td>{e.data.split("T1")[1].split(".")[0]}</Td>
                            <Td>R$:{e.valor}</Td>
                            <Td>R$:{e.saldo}</Td>
                            
                        </Tr>
                    ))
                }
            </Table>
        </Container>
        
    )
}

