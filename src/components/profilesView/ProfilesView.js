import { useEffect, useState, useContext } from "react"
import { useNavigate, useParams} from 'react-router-dom'

import './profilesView.scss'
import testImg from '../../p.png'
import { useFetch } from '../../helpers'
import { AuthContext } from "../../context/datacontext"
import icons from "../icons"
import NotFound from "../notFound/notFound"
import { SimplePost } from "../Post/simplePost/simplePost"

function ProfileBody() {
    const { username, tab } = useParams()
    const { get, loading } = useFetch()
    const navigate = useNavigate()
    const { auth } = useContext(AuthContext)

    const [posts, setPosts] = useState([])

    function get_filter_for_tab(tab){
        if (tab==='saved'){
            return 'is_saved=True'
        }else if(tab=='tagged'){
            return '' //TODO: review how to do this
        } else {
            return 'user='+auth?.user.id
        }
    }

    useEffect(() => {
        get('post/?'+get_filter_for_tab(tab)).then(data => setPosts(data.map((i, k) => <SimplePost data={i} key={k} />)))
    }, [tab]);

    return (
        <div className="profile-body">
            <ul className="tablist">
                {/* TODO: review tabs */}
                <li className={!tab ?? 'current'} onClick={() => navigate(`/${username}`)}>{icons.posts} Publicaciones</li>
                <li className={tab === 'saved' ?? 'current'} onClick={() => navigate(`/${username}/saved`)}>{icons.save} Guardado</li>
                <li className={tab === 'tagged' ?? 'current'} onClick={() => navigate(`/${username}/tagged`)}>{icons.tagged} Etiquetadas</li>
            </ul>
            {loading&&'cargando...'}
            <div className="SimplePostContainer">{posts}</div>
        </div>
    )
}

export default function ProfilesView() {
    const navigate = useNavigate()
    const { username } = useParams()
    const { auth } = useContext(AuthContext)
    const { get, post, remove, loading } = useFetch(false)

    const [user, setUser] = useState({})
    const [following, setFollowing] = useState()
    const [isSesionUser, setIsSesionUser] = useState(false)
    const [notFound, setNotFound] = useState(false)

    useEffect(() => {
        get('user/' + username).then(data => {
            if (data.detail) setNotFound(true)
            else {
                setUser(data)
                setFollowing(data.following)
                setIsSesionUser(auth.user.id === data.id)
            }
        })
    }, [username])

    const createMessaje = () => {
        post('chatlist/', { username }).then(() => navigate('/inbox/' + username))
    }

    const handleFollow = () => {
        //TODO: validate that user cannot click if nothing loaded
        let body = { "following": user.id }
        if (!following)
            post('follow/', body).then(() => {
                setFollowing(!following)
                setUser({ ...user, followers_count: user.followers_count + 1 })
            })
        else
            remove('follow/', body).then(() => {
                setFollowing(!following)
                setUser({ ...user, followers_count: user.followers_count - 1 })
            })
    }

    if (notFound) return <NotFound />
    return (
        <>
            <div className="profilesView">
                <div className="user-image"><img src={user.image || testImg} alt="" /></div>
                <div className="profile-data">
                    <div className="profile-name">
                        <h1>{user.username}</h1>
                        {isSesionUser ?
                            <>
                                <button onClick={()=>navigate('/edit')}>Editar Perfil</button>
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
                        <span><b>{user.posts_count}</b> publicaciones</span>
                        <span><b>{user.followers_count}</b> seguidores</span>
                        <span><b>{user.following_count}</b> seguidos</span>
                    </p>
                    <p className="name"><b>{user.name}</b></p>
                    <p className="desc">{user.description}</p>
                </div>
            </div>
            <ProfileBody />
        </>
    )
}
