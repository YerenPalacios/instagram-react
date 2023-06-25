import React, { useEffect, useState, useContext, ChangeEvent } from "react"
import api from '../../api.json'
import { AuthContext } from "../../context/datacontext"
import { UpdateUserSesion, useFetch } from '../../helpers'
import './profileForm.scss'


export function ProfileForm() {
    const authContext = useContext(AuthContext)
    const { get, put } = useFetch()
    const [user, setUser] = useState<User>()

    const [updateData, setUpdateData] = useState({
        username: '',
        description: '',
        email: '',
        name: ''
    })

    useEffect(() => {
        get("user/" + authContext?.auth?.user.username)
            .then(data => {
                setUser(data)
                setUpdateData({
                    name: data.name,
                    username: data.username,
                    email: data.email,
                    description: data.description
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
        put("user/" + authContext?.auth?.user.username, updateData)
            .then((data: User) => {
                if (UpdateUserSesion(data)) {
                    let token = authContext.auth?.token ?? ''
                    authContext.setAuth({ token, user: data })
                    // setAuth(getUserSesion())
                }
            })
    }

    return (
        <div className="profile-form">
            <div className="profile">
                <img src={user?.image} alt="" />
                <div>
                    <p>{user?.username}</p>
                    <p className="change-image">Cambiar foto del perfil</p>
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
                <img src={api.url + user?.image} alt="" />
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