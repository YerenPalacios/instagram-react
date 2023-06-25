import React, { useEffect } from "react";
import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LocalStorage } from "../services/LocalStorage.service";

const NO_AUTH_PATH = [
  '/login', '/password-reset', '/'
]

type AuthContextProps = {
  auth: Auth | undefined;
  setAuth: (value: Auth) => void
};

export const AuthContext = createContext<AuthContextProps>({ auth: undefined, setAuth: () => { } })

export const AuthProvider: React.FC = ({ children }) => {
  const navigate = useNavigate()
  const [auth, setAuth] = useState(LocalStorage.get('auth'))
  useEffect(() => {
    !auth && !NO_AUTH_PATH.includes(window.location.pathname) && navigate('/login')
  }, [])

  return <AuthContext.Provider value={{ auth, setAuth, }}>{children}</AuthContext.Provider>
}

type ErrorContextProps = {
  error: string,
  setError: (value: string) => void
};

export const ApiErrorContext = createContext<ErrorContextProps>({ error: '', setError: () => { } })

export const ApiErrorProvider: React.FC = ({ children }) => {
  const [error, setError] = useState("")
  return <ApiErrorContext.Provider value={{ error, setError }}>{children}</ApiErrorContext.Provider>
}


type PostContextProps = {
  posts: Post[],
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>
};

export const PostContext = createContext<PostContextProps>({ posts: [], setPosts: () => { } })

export const PostProvider: React.FC = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([])
  return <PostContext.Provider value={{ posts, setPosts }}>{children}</PostContext.Provider>
}

type PageContextProps = {
  limit: number,
  offset: number,
  setOffset: React.Dispatch<React.SetStateAction<number>>,
  setLimit: React.Dispatch<React.SetStateAction<number>>,
}

const PageContextDefault = {
  limit: 10,
  offset: 0,
  setOffset: () => { },
  setLimit: () => { },
}

export const PageContext = createContext<PageContextProps>(PageContextDefault)

export const PageProvider: React.FC = ({ children }) => {
  const [limit, setLimit] = useState(PageContextDefault.limit)
  const [offset, setOffset] = useState(PageContextDefault.offset)
  return <PageContext.Provider value={{ limit, offset, setLimit, setOffset }}>{children}</PageContext.Provider>
}