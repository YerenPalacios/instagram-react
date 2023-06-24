import { useEffect, useState } from "react"
import { useFetch } from "../helpers"


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
