import axios from "axios"
import React from "react"

const BaseUrl = "http://127.0.0.1:8000/bancario/extrato-saldo/"

export default function SaldoBlock(){
    const [post, setPost] = React.useState(null);

    var count = 0
    React.useEffect(() => {
        axios.post(BaseUrl, {
            username: "tt"
        }).then(response => {
            setPost(response.data)
            console.log("algo",response)
        });
        console.log("REQUISAO")
    }, [])
    let saldo = 0
    if (!post) return "no post"


    return(
        
        <div>
            {
                post.map((e) => (
                    <p>{e.saldo} e {e.data}</p>
                    
                ))
            }
        </div>
        
    )
}

