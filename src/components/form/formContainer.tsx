import React from 'react'
import { useState } from "react";

import './loginForm.scss'

import { LoginForm } from './loginForm';
import { RegForm } from './regForm';

export default function FormContainer() {

    const [form, setForm] = useState('login')
    const toggleForm = () => {
        var current = form === 'login' ? 'reg' : 'login'
        setForm(current)
    }

    // TODO: django validation fields

    return <div className="formContainer">
        {form === 'reg' ? <RegForm /> : <LoginForm />}
        <div className="block">
            {form === 'reg' ?
                <p>¿Tienes una cuenta? <span onClick={toggleForm}>Inicia sesión</span></p> :
                <p>¿No tienes una cuenta? <span onClick={toggleForm} >Registrate</span></p>
            }
        </div>
    </div>
}