import './chatBox.scss';
import infoIcon from './info.png'
import { default as icon } from '../icons'
import React, { useState, useEffect, FormEvent } from 'react';


import { getUserImage, useFetch } from '../../helpers';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Loading from '../Base/loading/loading';
import { useWebSocket } from '../../hooks/chatLisHook';

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
    const [messages, setMessages] = useState<Message[]>([])
    const items_div = document.getElementById('items')

    const addMessages = (data: any, type: string): void => {
        if (type === 'get_messages'){
            setMessages(data.sort((a, b) => a.id - b.id));
        }
        if (type === 'add_message'){
            setMessages((prev)=>prev.concat(data))
        }
        if (type === ''){
            setMessages([])
        }
    }

    const { send, connectionStatus } = useWebSocket({
        setComponentData: addMessages,
        dependency: room
    })

    useEffect(() => {
        items_div && items_div.scrollTo(0, items_div.scrollHeight)
    }, [messages])


    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const message = (e.target as HTMLFormElement)['message']
        send({ action: 'add_message', text: message.value })
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
                            if (v.is_post) return <div key={i} className={cl}><PostMessage post_id={parseInt(v.content)} /></div>
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
