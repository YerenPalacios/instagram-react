import './chatBox.scss';
import infoIcon from './info.png'
import { default as icon } from './../icons'
import moment from 'moment';
import { useState, useEffect, useContext} from 'react';
import api from '../../api.json'

import testImg from '../../p.png'
import { ApiErrorContext, AuthContext } from '../../context/datacontext';

const connectionStates = [
    'Connecting',
    'Open',
    'Closing',
    'Closed',
    'Uninstantiated',
];

export default function ChatBox({ room }) {
    const [ws, setWs] = useState()
    const [connectionStatus, setConnectionStatus] = useState(3)
    const [messages, setMessages] = useState([])
    const items_div = document.getElementById('items')
    const {auth} = useContext(AuthContext);
    const { error, setError } = useContext(ApiErrorContext)

    useEffect(() => {
        let ws = new WebSocket(api.ws + `chat2/?room_id=${room.id}&token=${auth.token}`)
        setWs(ws)
        return () => { setMessages([]); ws.close() }
    }, [room]);

    useEffect(()=>{
        items_div && items_div.scrollTo(0, items_div.scrollHeight)
    },[messages])
    
    if (ws){
        ws.onopen = (e) => {
            console.warn('WebSocket Connected');
            setConnectionStatus(ws.readyState)
        }
        ws.onmessage = (e) => {
            const data = JSON.parse(e.data)
            if (data.detail)
                return setError(data.detail)
            
            if (data.type === 'get_messages'){
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

    const handleSubmit = (e) => {
        e.preventDefault();
        ws.send(JSON.stringify(
            {action:'add_message',text: e.target['message'].value}
        ))
        e.target['message'].value = ''
    }

    return (
        <div className="chatBox">
            <div className="head">
                <div className="user">
                    <img src={room.user.image? api.url + room.user.image: testImg} alt="i" />
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
                            if (v.is_post) return <div className={cl}>{parseInt(v.content)}</div>
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