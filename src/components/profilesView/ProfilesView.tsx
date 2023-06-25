import React, { useEffect, useState, useContext } from "react"
import { useNavigate, useParams } from 'react-router-dom'

import './profilesView.scss'
import { getUserImage, useFetch } from '../../helpers'
import { AuthContext, PageContext } from "../../context/datacontext"
import icons from "../icons"
import NotFound from "../notFound/notFound"
import { SimplePost } from "../Post/simplePost/simplePost"
import Loading from "../Base/loading/loading"

function ProfileBody() {
    const navigate = useNavigate()
    const { get, loading } = useFetch()
    const { auth } = useContext(AuthContext)
    const { offset, setOffset, limit} = useContext(PageContext)
    const { username, tab } = useParams<{ username: string, tab: string }>()

    const [posts, setPosts] = useState<Post[]>([])

    function get_filter_for_tab(tab: string | undefined) {
        if (tab === 'saved') {
            return 'is_saved=True'
        } else if (tab == 'tagged') {
            return '' //TODO: review how to do this
        } else {
            return 'user=' + auth?.user.id
        }
    }

    console.log(offset)

    useEffect(() => {
        get('post/?' + get_filter_for_tab(tab) + '&offset=' + offset + '&limit=' + limit).then((data: Post[]) => {
            setPosts(prev => {
                let a = [...prev]
                data.forEach(i => {
                    if (!a.find(item => item.id == i.id)) {
                        a.push(i)
                    }
                })
                return a
            })
        })
    }, [tab, offset]);


    const changeTab = (path: string)=>{
        setPosts([])
        setOffset(0)
        navigate(path)
    }

    return (
        <div className="profile-body">
            <ul className="tablist">
                {/* TODO: review tabs */}
                <li className={!tab ? 'current' : ''} onClick={() => changeTab(`/${username}`)}>{icons.posts}<p>Publicaciones</p></li>
                <li className={tab === 'saved' ? 'current' : ''} onClick={() => changeTab(`/${username}/saved`)}>{icons.save}<p>Guardado</p></li>
                <li className={tab === 'tagged' ? 'current' : ''} onClick={() => changeTab(`/${username}/tagged`)}>{icons.tagged}<p>Etiquetadas</p></li>
            </ul>
            <div className="SimplePostContainer">{posts.map((post: Post) => <SimplePost data={post} key={post.id} />)}</div>
            {loading && <Loading />}
        </div>
    )
}

export default function ProfilesView() {
    const navigate = useNavigate()
    const { username } = useParams()
    const { auth } = useContext(AuthContext)
    const { get, post, remove, loading } = useFetch(false)

    const [user, setUser] = useState<User>()
    const [following, setFollowing] = useState<Boolean>()
    const [isSesionUser, setIsSesionUser] = useState(false)
    const [notFound, setNotFound] = useState(false)

    useEffect(() => {
        get('user/' + username).then(data => {
            if (data.detail) setNotFound(true)
            else {
                setUser(data)
                setFollowing(data.following)
                setIsSesionUser(auth?.user.id === data.id)
            }
        })
    }, [username])

    const createMessaje = () => {
        post('chatlist/', { username }).then(() => navigate('/inbox/' + username))
    }

    const handleFollow = () => {
        let body = { "following": user?.id }
        if (!following)
            post('follow/', body).then(() => {
                setFollowing(!following)
                user && setUser({ ...user, followers_count: user.followers_count ?? 0 + 1 })
            })
        else
            remove('follow/', body).then(() => {
                setFollowing(!following)
                user && setUser({ ...user, followers_count: user.followers_count ?? 0 - 1 })
            })
    }

    if (notFound) return <NotFound />
    return (
        <div>
            <div className="profilesView">
                <div className="user-image"><img src={user && getUserImage(user)} alt="" /></div>
                <div className="profile-data">
                    <div className="profile-name">
                        <h1>{user?.username}</h1>
                        {isSesionUser ?
                            <>
                                <button onClick={() => navigate('/edit')}>Editar Perfil</button>
                                <div>{icons.setting}</div>
                            </> :
                            <>
                                <button onClick={createMessaje}>Enviar mensaje</button>
                                <button disabled={loading} onClick={handleFollow}>
                                    {following ? 'unfollow' : 'follow'}
                                </button>
                                <button>A</button>
                                <div>...</div>
                            </>
                        }
                    </div>
                    <p className="profile-nums">
                        <span><b>{user?.posts_count}</b> publicaciones</span>
                        <span><b>{user?.followers_count}</b> seguidores</span>
                        <span><b>{user?.following_count}</b> seguidos</span>
                    </p>
                    <p className="name"><b>{user?.name}</b></p>
                    <p className="desc">{user?.description}</p>
                </div>
            </div>
            <ProfileBody />
        </div>
    )
}
