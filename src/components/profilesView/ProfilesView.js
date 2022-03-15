import { useEffect, useState } from "react"
import {useParams} from 'react-router-dom'
import {Link} from 'react-router-dom'

import api from '../../api.json'
import './profilesView.css'

export default function ProfilesView(){
    const {username} = useParams()
    const isSesionUser = false
    const [user, setUser] = useState({})
    const [notFound, setNotFound] = useState(false)

    useEffect(()=>{
        fetch(api.url+'user/'+username)
        .then(res => res.json())
        .then(data => {
            if(data.detail){
                setNotFound(true)
            } else {
               setUser(data) 
            }
            
        })
    },[])

    if (notFound){
        return(
            <div className="not-found">
                <h1>Esta página no está disponible.</h1>
                <p>Es posible que el enlace que seleccionaste esté roto o que se haya eliminado la página.</p>
                <Link to="/">Volver a Instagram.</Link>
            </div>
        )
    }
    return(
        <div className="profilesView">
            <div className="user-image">
                <img src={user.image} alt="" />
            </div>
            <div className="profile-data">
                <div className="profile-name">
                    <h1>{user.username}</h1>
                    {isSesionUser?
                        <>
                            <button>Editar perfil</button>
                            <div>o</div>
                        </>:
                        <>
                            <button>Enviar mensaje</button>
                            <button>follow</button>
                            <button>A</button>
                            <div>...</div>
                        </>
                    }
                </div>
                <p className="profile-nums">
                    <span><b>0</b> publicaciones</span>
                    <span><b>0</b> seguidores</span>
                    <span><b>0</b> seguidos</span>
                </p>
                <p className="name"><b>{user.name}</b></p>
                <p className="desc">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas qui officia rerum quis eligendi perspiciatis, nemo maxime eveniet eum consequuntur nulla cumque recusandae amet deserunt accusantium, odio quasi rem sed?
                </p>
            </div>
        </div>
    )
}