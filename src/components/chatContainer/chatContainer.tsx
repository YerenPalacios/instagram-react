import React, { useEffect, useState } from 'react';
import ChatBox from '../chatBox/chatBox';
import { useFetch } from '../../helpers'
import './chatContainer.scss';
import api from '../../api.json'
import moment from 'moment'
import testImg from '../../p.png'
import { useNavigate, useParams } from 'react-router-dom';

export default function ChatContainer() {
    const { username } = useParams()
    const navigate = useNavigate()
    const { get } = useFetch()
    const [users, setUsers] = useState<ChatResponse[]>([])
    const [actualChat, setActualChat] = useState<ChatResponse | null>(null)

    useEffect(() => {
        get('chatlist/').then(data => {
            setUsers(data)
            username && setActualChat(
                users.find((i) => (i.user.username === username ?? i)) ?? null
            )
        })      
    }, [username])

    const openChat = (room: {user: User}) => {
        console.log(room, actualChat)
        navigate('/inbox/' + room.user.username)
    }

    return (
        <div className="chat-container">
            <div className="chat">
                <div style={{ width: 300 }}>
                    {users.map((i, k) => (
                        <div key={k} className="person" onClick={() => openChat(i)}>
                            <img src={i.user.image ? api.url + i.user.image : testImg} alt="" />
                            <div>
                                <p>{i.user.name}</p>
                                {i.last_message.content && <p>{i.last_message.content} . {moment(i.last_message.timestamp).fromNow()}</p>}
                            </div>
                        </div>
                    ))}
                </div>
                {actualChat && <ChatBox room={actualChat} />}
            </div>
        </div>
    )
}
