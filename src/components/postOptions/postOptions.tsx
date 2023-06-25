import './postOptions.scss';
import React, { useContext } from 'react'
import { useFetch } from '../../helpers';
import { useNavigate } from 'react-router-dom';
import { PostContext } from '../../context/datacontext';


export default function PostOptions({ id, hide }: { id: number, hide: (value: boolean) => void }) {
    const navigate = useNavigate()
    const { remove } = useFetch()
    const { posts, setPosts } = useContext(PostContext)
    const handleDelete = () => {
        remove('post/' + id).then(()=>{
            setPosts(posts.filter(post=>post.id !== id))
        })
    }

    const goPost = () => {
        navigate('post/' + id)
    }

    return (
        <div className="post-options">
            <div onClick={() => hide(false)} className="close-item"></div>
            <div className="options">
                <button onClick={handleDelete}>Eliminar</button>
                <button onClick={goPost}>Ir a la publicación</button>
            </div>
        </div>
    )
}
