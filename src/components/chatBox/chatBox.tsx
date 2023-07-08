import './chatBox.scss';
import infoIcon from './info.png'
import { default as icon } from '../icons'
import React, { useState, useEffect, useContext, FormEvent } from 'react';
import api from '../../api.json'

import { ApiErrorContext, AuthContext } from '../../context/datacontext';
import { getUserImage, useFetch } from '../../helpers';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Loading from '../Base/loading/loading';

const connectionStates = [
    'Connecting',
    'Open',
    'Closing',
    'Closed',
    'Uninstantiated',
];

function PostMessage({ post_id }: { post_id: number }) {
    const { get, loading } = useFetch()
    const dispatch = useDispatch();
    const [postInfo, setPostInfo] = useState<Post>()
    const [image, setImage] = useState(postInfo?.files ? postInfo?.files && postInfo?.files[0].file : '')
    const [isValidPost, setIsValidPost] = useState(true)

    const invalidPost = ()=>{
        setIsValidPost(false)
    }

    useEffect(() => {
        get('post/' + post_id, invalidPost).then(data => setPostInfo(data))
    }, []);

    const handleClick = () => {
        dispatch({
            type: "SET_CURRENT_POST",
            payload: postInfo
        })
    }

    useEffect(() => {
        if (postInfo) {
            if (postInfo.files) {
                if (postInfo.files[0].thumbnail) setImage(postInfo?.files[0].thumbnail)
                else setImage(postInfo?.files[0].file)
            }
        }

    }, [postInfo])

    if (!isValidPost) return <div className="post-message invalid-message">Couldn´t load this message</div>

    if (loading) return <div className="post-message invalid-message"><Loading></Loading></div>
    return <div className="post-message">
        <div className="user">
            <div className="image"><img src={postInfo?.user && getUserImage(postInfo.user)} alt="" /></div>
            <Link to={"/" + postInfo?.user?.username}>{postInfo?.user?.username}</Link>
        </div>
        <div className='post-content' onClick={handleClick}>
            <img src={image} alt="" />
        </div>
        <div><b>{postInfo?.user?.username}</b>&nbsp;&nbsp;{postInfo?.text}</div>
    </div>
}

type ChatRoom = {
    id: number,
    last_message: Message,
    user: User
}

export default function ChatBox({ room }: { room: ChatRoom }) {
    const [ws, setWs] = useState<WebSocket>()
    const [connectionStatus, setConnectionStatus] = useState(3)
    const [messages, setMessages] = useState<Message[]>([])
    const items_div = document.getElementById('items')
    const { auth } = useContext(AuthContext);
    const { error, setError } = useContext(ApiErrorContext)

    useEffect(() => {
        let ws = new WebSocket(api.ws + `chat2/?room_id=${room.id}&token=${auth?.token}`)
        setWs(ws)
        return () => { setMessages([]); ws.close() }
    }, [room]);

    useEffect(() => {
        items_div && items_div.scrollTo(0, items_div.scrollHeight)
    }, [messages])

    if (ws) {
        ws.onopen = (e) => {
            console.warn('WebSocket Connected');
            setConnectionStatus(ws.readyState)
        }
        ws.onmessage = (e) => {
            const data = JSON.parse(e.data)
            if (data.detail)
                return setError(data.detail)

            if (data.type === 'get_messages') {
                const saved_messages = data.data;
                setMessages(saved_messages);
            } else {
                console.warn(data)
                setMessages(messages.concat(data))
            }
        }
        ws.onclose = () => {
            console.warn('WebSocket Disconnected');
            setConnectionStatus(ws.readyState)
        }

    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const message = (e.target as HTMLFormElement)['message']
        ws?.send(JSON.stringify(
            { action: 'add_message', text: message.value }
        ))
        message.value = ''
    }

    return (
        <div className="chatBox">
            <div className="head">
                <div className="user">
                    <img src={getUserImage(room.user)} alt="i" />
                    <p>{room.user.name} Stataus: {connectionStates[connectionStatus]}</p>
                </div>
                <button><img src={infoIcon} alt="i" /></button>
            </div>

            <div className="body">
                <div className="history">
                    <div id="items" className="items">
                        {messages.map((v, i) => {
                            let cl = 'item other'
                            if (room.user.id !== v.user) cl = 'item'
                            if (v.is_post) return <div className={cl}><PostMessage key={i} post_id={parseInt(v.content)} /></div>
                            return (<div key={i} className={cl}>{v.content}</div>)
                        })}

                    </div>
                </div>
                <form autoComplete="off" onSubmit={handleSubmit}>
                    <div>{icon.face}</div>
                    <input type="text" name="message" placeholder="Send message" />
                    <div>{icon.like_svg}</div>
                </form>
            </div>
        </div>
    )

}