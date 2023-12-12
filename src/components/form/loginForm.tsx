import './loginForm.scss'
import { ChangeEvent, FormEvent, useContext, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../context/datacontext"
import { LocalStorage } from "../../services/LocalStorage.service"
import { useFetch } from "../../helpers"
import React from "react"
import { useDispatch } from 'react-redux'

export function LoginForm() {
    const navigate = useNavigate()
    const { login, get } = useFetch()
    const { setAuth } = useContext(AuthContext)
    const emailInput = useRef<HTMLInputElement | null>(null)
    const passInput = useRef<HTMLInputElement | null>(null)
    const dispatch = useDispatch();

    const handleLogin = (e: FormEvent) => {
        let email: string = emailInput.current?.value ?? ''
        let password: string = passInput.current?.value ?? ''
        e.preventDefault()
        if (email.length > 0 && password.length > 0) {
            login({ email, password }).then((data: Auth) => {
                if (data && JSON.stringify(data) !== "[]") {
                    LocalStorage.set('auth', data)
                    setAuth(data)
                    if (window.location.pathname !== '/')
                        navigate('/')
                    else{
                        dispatch({
                            type: "CLEAN_LOGIN"
                        })
                        navigate('/'+data.user.username)
                    }
                        
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
        <div className="block">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/2560px-Instagram_logo.svg.png" alt="" className="logo" />
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
        </div>
        
    )
}