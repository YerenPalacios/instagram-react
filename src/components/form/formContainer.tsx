import React, { ChangeEvent, FormEvent } from 'react'
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import './loginForm.scss'
import { AuthContext } from "../../context/datacontext";
import { useFetch } from "../../helpers";
import { LocalStorage } from "../../services/LocalStorage.service";
import { useRef } from "react";

function RegForm() {
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

        if (email?.length || phone?.length && name?.length && password?.length) {
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
    )
}

function LoginForm() {
    const navigate = useNavigate()
    const { login, get } = useFetch()
    const { setAuth } = useContext(AuthContext)
    const emailInput = useRef<HTMLInputElement | null>(null)
    const passInput = useRef<HTMLInputElement | null>(null)

    const handleLogin = (e: FormEvent) => {
        let email: string = emailInput.current?.value ?? ''
        let password: string = passInput.current?.value ?? ''
        e.preventDefault()
        if (email.length > 0 && password.length > 0) {
            login({ email, password }).then((data: Auth) => {
                if (data && JSON.stringify(data) !== "[]") {
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
                if (!data.exists) {
                    e.target.classList.add('invalid-input')
                } else {
                    e.target.classList.remove('invalid-input')
                }
            })
        }
    }

    return (
        <form>
            <div className="inputs">
                {/* TODO: add label in inputs */}
                <input onInput={handleChange} type="text" name="email" ref={emailInput} placeholder="Teléfono, usuario o correo electrónico" />
                <input type="password" name="password" ref={passInput} placeholder="Contraseña" />
                <button onClick={handleLogin}>Iniciar sesión</button>
                <div className="or">
                    <span></span>
                    <p>OR</p>
                    <span></span>
                </div>
                <a className="link2" href="/password-reset">¿Olvidaste tu contraseña?</a>
            </div>
        </form>
    )
}

export default function FormContainer() {


    const [form, setForm] = useState('login')


    const toggleForm = () => {
        var actual = form === 'login' ? 'reg' : 'login'
        setForm(actual)
    }

    // TODO: django validation fields

    return <div className="formContainer">
        <div className="block">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/2560px-Instagram_logo.svg.png" alt="" className="logo" />
            {form === 'reg' ? <RegForm /> : <LoginForm />}
        </div>
        <div className="block">
            {form === 'reg' ?
                <p>¿Tienes una cuenta? <span onClick={toggleForm}>Inicia sesión</span></p> :
                <p>¿No tienes una cuenta? <span onClick={toggleForm} >Registrate</span></p>
            }
        </div>
    </div>
}