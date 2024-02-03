import { default as ico } from '../icons'
import './header.scss'
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/datacontext';
import { getUserImage, useComponentVisible } from '../../helpers';
import { useDispatch } from 'react-redux';


export default function UserMenu() {
    const { auth } = useContext(AuthContext)
    const navigate = useNavigate()
    const { ref, isVisible } = useComponentVisible(false);
    const dispatch = useDispatch();

    const logout = () => {
        localStorage.removeItem('auth')
        navigate('/login')
    }

    const showLoginForm = () => {
        dispatch({
            type: "SHOW_LOGIN_FORM",
            payload: {}
        });
    }

    if (auth)
        return (
            <div className="user-menu" ref={ref}>
                <div className="user-icon">
                    <img src={getUserImage(auth.user)} alt="" />
                </div>
                <p className='label'>Profile</p>
                {isVisible && (
                    <div className="menu">
                        <Link to={"/" + auth.user.username}>{ico.profile} Perfil</Link>
                        <Link to={`/${auth.user.username}/saved`}>{ico.save} Guardado</Link>
                        <Link to={"/edit"}>{ico.settings} Configuración</Link>
                        <button onClick={showLoginForm}>{ico.change} Cambiar de cuenta</button>
                        <p onClick={logout} >Salir</p>
                    </div>
                )}
            </div>
        )
    else return null
}