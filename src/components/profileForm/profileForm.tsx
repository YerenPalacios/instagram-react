import React, { useEffect, useState, useContext, ChangeEvent } from "react"
import api from '../../api.json'
import { AuthContext } from "../../context/datacontext"
import { UpdateUserSesion, getUserImage, useFetch } from '../../helpers'
import './profileForm.scss'


export function ProfileForm() {
    const authContext = useContext(AuthContext)
    const { get, put } = useFetch()
    const [user, setUser] = useState<User>()
    const [currentImage, setCurrentImage] = useState<string>()

    const [updateData, setUpdateData] = useState({
        username: '',
        description: '',
        email: '',
        name: '',
        image: {}
    })

    useEffect(() => {
        get("user/" + authContext?.auth?.user.username)
            .then(data => {
                setUser(data)
                setUpdateData({
                    name: data.name,
                    username: data.username,
                    email: data.email,
                    description: data.description,
                    image: data.image
                })
            })
    }, [authContext])

    const handleUpdateData = ({ target }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setUpdateData({
            ...updateData,
            [target.name]: target.value
        })
    }

    const handleSubmitData = () => {
        const formData = new FormData();
        for (let key in updateData) {
            if (updateData.hasOwnProperty(key)) {
              formData.append(key, updateData[key]);
            }
        }
        put("user/" + authContext?.auth?.user.username, formData)
            .then((data: User) => {
                if (UpdateUserSesion(data)) {
                    let token = authContext.auth?.token ?? ''
                    authContext.setAuth({ token, user: data })
                    // setAuth(getUserSesion())
                }
            })
    }

    const handleFile = (e: ChangeEvent<HTMLInputElement>)=>{
        const file  = e.target.files
        if (file){
            const url = URL.createObjectURL(file[0])
            setCurrentImage(url)
            setUpdateData(prev=>({...prev, image: file[0]}))
        }
    }

    return (
        <div className="profile-form">
            <div className="profile">
                <img src={currentImage ?? (user && getUserImage(user))} alt="" />
                <div>
                    <p>{user?.username}</p>
                    <label htmlFor="image-file" className="change-image">Cambiar foto de perfil</label>
                    <input onChange={handleFile} hidden id="image-file" type="file" className="change-image"></input>
                </div>
            </div>
            <div className="input">
                <p className="label">Nombre</p>
                <input name="name" onChange={handleUpdateData} type="text" value={updateData.name} />
            </div>
            <div className="input">
                <p className="label">Nombre de usuario</p>
                <input name="username" onChange={handleUpdateData} type="text" value={updateData.username} />
            </div>
            <div className="input">
                <p className="label">Correo electrónico</p>
                <input name="email" onChange={handleUpdateData} type="text" value={updateData.email} />
            </div>
            <div className="input">
                <p className="label">Bio</p>
                <textarea name="description" onChange={handleUpdateData} value={updateData.description}></textarea>
            </div>
            <button onClick={handleSubmitData} className="submit">Enviar</button>
        </div>
    )
}

export function PasswordForm() {
    const { auth } = useContext(AuthContext)
    const [user, setUser] = useState<User>()

    const [passwordData, setPasswordData] = useState({
        lastPassword: '',
        newPassword: '',
        confirmPassword: ''
    })

    useEffect(() => {
        auth && setUser(auth.user)
    }, [])

    const handlePasswordData = ({ target }: ChangeEvent<HTMLInputElement>) => {
        setPasswordData({
            ...passwordData,
            [target.name]: target.value
        })
    }

    const handleSubmitPasswordData = () => {
        console.log(passwordData)
    }

    return (
        <div className="profile-form">
            <div className="profile">
                <img src={user && getUserImage(user)} alt="" />
                <div>
                    <p>{user?.username}</p>
                </div>
            </div>
            <div className="input">
                <p className="label">Contraseña anterior</p>
                <input onChange={handlePasswordData} type="password" name="lastPassword" value={passwordData.lastPassword} />
            </div>
            <div className="input">
                <p className="label">Contraseña nueva</p>
                <input onChange={handlePasswordData} type="password" name="newPassword" value={passwordData.newPassword} />
            </div>
            <div className="input">
                <p className="label">Confirmar contraseña nueva</p>
                <input onChange={handlePasswordData} type="password" name="confirmPassword" value={passwordData.confirmPassword} />
            </div>
            <button onClick={handleSubmitPasswordData} className="submit">Cambiar contraseña</button>
        </div>
    )
}
