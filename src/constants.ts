export const LOGIN_PATH = 'login/'
export const SIGN_PATH = 'sign-up/'
export const NO_AUTH_PATHS = [SIGN_PATH, LOGIN_PATH, 'user-exists/']

export const API_URL = process.env.BACKEND_URL ?? "http://127.0.0.1:8000/"
export const WS_API_URL = process.env.BACKEND_WS ?? "ws://127.0.0.1:8000/"