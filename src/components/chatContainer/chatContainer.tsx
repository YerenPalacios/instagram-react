import React, { useEffect, useState, useContext } from 'react';
import ChatBox from '../chatBox/chatBox';
import { getUserImage, useFetch } from '../../helpers'
import './chatContainer.scss';
import moment from 'moment'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../context/datacontext';
import icons from '../icons';

export default function ChatContainer() {
    const { username } = useParams()
    const navigate = useNavigate()
    const { auth } = useContext(AuthContext)
    const { get } = useFetch()
    const [users, setUsers] = useState<ChatResponse[]>([])
    const [currentChat, setCurrentChat] = useState<ChatResponse | null>(null)

    const ChangeCurrentChat = (data: ChatResponse[]) => {
        setCurrentChat(
            data.find((i) => (i.user.username === username ?? i)) ?? null
        )
    }

    useEffect(() => {
        get('chatlist/').then((data: ChatResponse[]) => {
            setUsers(() => {
                ChangeCurrentChat(data)
                return data
            })

        })
    }, [])

    useEffect(() => {
        ChangeCurrentChat(users)
    }, [username])

    const openChat = (room: { user: User }) => {
        navigate('/inbox/' + room.user.username)
    }

    return (
        <div className="chat-container">
            <div className="chat-list">
                <div className="chat-list-head">
                    <br /><br />
                    <div>
                        <h2>{auth?.user.username} v</h2>
                        {icons.pen}
                    </div>
                    <br /> <br />
                    <div>
                        <p><b>Messages</b></p>
                        <Link to='/'>Requests</Link>
                    </div>
                </div>
                <br />
                <div className="chat-items">
                    {users.map((i, k) => {
                        let className = "person"
                        // review if it is group chat
                        if (i.user.username == username){
                            className += " current-person"
                        }

                        return <div key={k} className={className} onClick={() => openChat(i)}>
                            <img src={getUserImage(i.user)} alt="" />
                            <div>
                                <p>{i.user.name}</p>
                                {i.last_message.content && <p>{i.last_message.content} . {moment(i.last_message.timestamp).fromNow()}</p>}
                            </div>
                        </div>
                    })}
                </div>
            </div>
            <div className="chat">
                {
                    currentChat ?
                        <ChatBox room={currentChat} /> :
                        <div className="default-page">
                            {icons.message_circle}
                            <br />
                            <h2>Your messages</h2>
                            <p>Send private photos and messages to a friend or group</p>
                            <br />
                            <button className="primary">Send message</button>
                        </div>
                }
            </div>
        </div>
    )
}
