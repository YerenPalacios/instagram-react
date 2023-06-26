import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { ApiErrorContext, AuthContext } from './context/datacontext'
import { API_URL, LOGIN_PATH, NO_AUTH_PATHS, SIGN_PATH } from './constants'


export function UpdateUserSesion(user: User) {
    let authData = localStorage.getItem('auth')
    if (authData) {
        let authDataObj = JSON.parse(authData)
        user.image = user.image?.replace(API_URL, '')
        authDataObj.user = user
        localStorage.setItem('auth', JSON.stringify(authDataObj))
        return true
    }
    return false
}

export const useFetch = (auto_errors = true) => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);
    const controller = new AbortController()
    const { auth } = useContext(AuthContext)
    const { error, setError } = useContext(ApiErrorContext)

    useEffect(() => {
        return () => {
            if (controller) controller.abort()
        };
    }, []);

    const runFetch = async (path: string, options: RequestInit = {}): Promise<any> => {
        try {
            if (!auth && !NO_AUTH_PATHS.includes(path)) {
                navigate('/login')
                throw new Error('no autorizado')
            }
            const response = await fetch(API_URL + path, { signal: controller?.signal, ...options })
            if (response.status >= 500) throw new Error('¡Ha ocurrido un error!')

            if (response.status >= 400 && auto_errors) {
                response.json().then((data => {
                    throw new Error(data[Object.keys(data)[0]])
                }))
            }

            if (response.status >= 400) throw new Error('¡Ha ocurrido un error 400!')

            if (options.method === 'DELETE') return null
            return response.json()
        } catch (error) {
            if (error instanceof Error){
                const message = error.message
                setError(message) 
            } else {
                setError('Error desconocido')
            }  
        } finally {
            setLoading(false)
        }
        return []  
    }

    const login = (body: Object) => {
        setLoading(true);
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        }

        return runFetch(LOGIN_PATH, options)
    }

    const sign = (body: Object) => {
        setLoading(true);
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        }

        return runFetch(SIGN_PATH, options)
    }

    const get = (path: string) => {
        setLoading(true);
        const options = {
            method: 'GET',
            headers: {
                'Authorization': auth ? 'Token ' + auth.token : ''
            }
        }
        return runFetch(path, options)
    }

    const sendRecoveryEmail = (body: Object) => {
        setLoading(true);
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }

        return runFetch('/recovery-password', options)
    }

    const post = (path: string, body = {}) => {
        setLoading(true);
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth?.token,
            },
            body: JSON.stringify(body)
        }

        return runFetch(path, options)
    }

    const put = (path: string, body = {}) => {
        setLoading(true);
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth?.token,
            },
            body: JSON.stringify(body)
        }

        return runFetch(path, options)
    }

    const remove = (path: string, body = {}) => {
        setLoading(true);
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth?.token,
            },
            body: JSON.stringify(body)
        }

        return runFetch(path, options)
    }

    return { get, post, put, remove, login, sign, error, loading, setLoading, sendRecoveryEmail };
}

export function getUserImage(user: User) {
    // TODO: add user color field??
    if (user.image) return user.image.includes('http') ? user.image : API_URL + user.image
    const letter = user.username?.slice(0, 1).toUpperCase()
    const b = `<svg height="100" width="100" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" style="fill:${user.color}" />
    <text x="50%" y="57%" alignment-baseline="middle" fill="#fff" text-anchor="middle" font-size='40px' font-family='sans-serif'>${letter}</text>
    </svg>`
    const blob = new Blob([b], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)

    setTimeout(() => {
        URL.revokeObjectURL(url)
    }, 10000);

    return url
}
