import React, { useRef } from 'react'
import { useFetch } from '../helpers'
import './../components/form/loginForm.scss'

export default function ResetPasswordForm() {
    const userInfo = useRef<HTMLInputElement|null>(null)

    const {sendRecoveryEmail} = useFetch()

    const handleResetPasword = ()=>{
        sendRecoveryEmail({'email': userInfo.current?.value})
    }

    return (
        <div className="form-container">
            <div className="block">
               <img src="" alt="" />
               <h2>Trouble loggining in?</h2>
                <p>Enter your email, phone, or username and we'll send you a link to get back into your account.</p>
                <input ref={userInfo} type="text" placeholder='Email, Phone or Username'/>
                <button onClick={handleResetPasword}>send login link</button>
            </div>
        </div>
    )
}