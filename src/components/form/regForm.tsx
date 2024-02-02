import React, { ChangeEvent, FormEvent } from 'react'
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import './loginForm.scss'
import { AuthContext } from "../../context/datacontext";
import { useFetch } from "../../helpers";
import { LocalStorage } from "../../services/LocalStorage.service";
import { useRef } from "react";

export function RegForm() {
    const navigate = useNavigate()
    const { setAuth } = useContext(AuthContext)
    const { sign, get } = useFetch()


    const email_or_tel = useRef<HTMLInputElement | null>(null)
    const nameInput = useRef<HTMLInputElement | null>(null)
    const usernameInput = useRef<HTMLInputElement | null>(null)
    const passInput = useRef<HTMLInputElement | null>(null)

    const handleSign = (e: FormEvent) => {
        e.preventDefault()
        let email: string = email_or_tel.current?.value.includes('@') ? email_or_tel.current?.value : ''
        let phone: string | undefined = !email_or_tel.current?.value.includes('@') ? email_or_tel.current?.value : '';
        let name: string | undefined = nameInput.current?.value
        let username: string | undefined = usernameInput.current?.value
        let password: string | undefined = passInput.current?.value

        if ((email?.length || phone?.length) && name?.length && password?.length) {
            sign({ ...email ? { email } : { phone }, name, username, password })
                .then((data: Auth) => {
                    if (data.token) {
                        LocalStorage.set('auth', data)
                        setAuth(data)
                        navigate('/')
                    }
                })
        }
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        if (value.length) {
            get('user-exists/?value=' + value).then(data => {
                if (data.exists) {
                    e.target.classList.add('invalid-input')
                } else {
                    e.target.classList.remove('invalid-input')
                }
            })
        }
    }

    return (
        <div className="block">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/2560px-Instagram_logo.svg.png" alt="" className="logo" />
        <form onSubmit={handleSign}>
            <p className="desc">Regístrate para ver fotos y videos de tus amigos.</p>
            <div className="inputs">
                <input onInput={handleChange} ref={email_or_tel} type="text" placeholder="Número de celular o correo electrónico" />
                <input ref={nameInput} type="text" placeholder="Nombre completo" />
                <input onInput={handleChange} ref={usernameInput} type="text" placeholder="Nombre de usuairio" />
                <input ref={passInput} type="text" placeholder="Contraseña" />
                <button>Registrarse</button>
            </div>
        </form>
        </div>
    )
}
