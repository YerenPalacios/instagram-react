import { useContext, useEffect, useState } from "react"
import { useFetch } from "../helpers"
import { ApiErrorContext, AuthContext } from "../context/datacontext"
import api from '../api.json'


export default function ChatListHook(){
    const {get, post, loading} = useFetch()
    const [chatList, setChatList] = useState<ChatResponse[]>([])
    useEffect(() => {
        get('chatlist/').then(data => {
            setChatList(data)
        })  
    }, [])

    const createChatPostMessage = (chat_room_id: number, post_id:number, text: string)=>{

        return post('share-post/', {chat_room_id, post_id, text})
    }
    
    return {chatList, loading, createChatPostMessage}
}



type wsParams = {
    setComponentData: (data: any, type: string)=>void,
    dependency: any
}

export function useWebSocket({setComponentData, dependency}: wsParams){
    const [ws, setWs] = useState<WebSocket>()
    const [connectionStatus, setConnectionStatus] = useState(3)
    const { setError } = useContext(ApiErrorContext)
    const { auth } = useContext(AuthContext);

    useEffect(() => {
        let ws = new WebSocket(api.ws + `chat2/?room_id=${dependency.id}&token=${auth?.token}`)
        setWs(ws)
        return () => {console.log('muere ws') ;setComponentData([], ''); ws.close() }
    }, [dependency]);

    if (ws) {
        ws.onopen = (e) => {
            console.warn('WebSocket Connected');
            setConnectionStatus(ws.readyState)
        }

        ws.onmessage = (e) => {
            const result = JSON.parse(e.data)
            if (result.detail)
                return setError(result.detail)
            setComponentData(result.data, result.type)
        }

        ws.onclose = () => {
            console.warn('WebSocket Disconnected');
            setConnectionStatus(ws.readyState)
        }

    }

    const send = (data: any) => {
        ws?.send(JSON.stringify(data))
    }
    return {ws, send, connectionStatus}
    
}

