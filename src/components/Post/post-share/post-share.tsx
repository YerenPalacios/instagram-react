import React, { ChangeEvent, useRef, useState } from 'react';
import './post-share.scss';
import ChatListHook from '../../../hooks/chatLisHook';
import { getUserImage } from '../../../helpers';
import Loading from '../../Base/loading/loading';
import { useDispatch } from 'react-redux';

type ShareListParams = {
  post_id: number,
  chat_room_id: number
}

const PostShare = ({data}: {data:Post}) => {
  const dispatch = useDispatch()
  const { chatList, loading, createChatPostMessage} = ChatListHook()
  const [shareList, setShareList] = useState<ShareListParams[]>([])
  const inputMessageRef = useRef<HTMLInputElement | null>(null)

  const handleCheck = (e: ChangeEvent<HTMLInputElement>, chat_room_id: number)=>{
    if (e.target?.checked){
      setShareList([...shareList, {post_id: data.id, chat_room_id}])
    } else {
      setShareList([...shareList].filter(e=>e.chat_room_id!==chat_room_id))
    }
  }

  const handleSharePost = ()=>{
    shareList.forEach(item=>{
      createChatPostMessage(item.chat_room_id, item.post_id, inputMessageRef.current?.value ?? '')
      .then(()=>dispatch({
          type: "CLEAN_SHARING_POST"
      }))
    })
  }

  return (
    <div className="post-share">
      <h1>Share</h1>
      <div className="to">To:&nbsp;&nbsp;&nbsp;<input type="text" placeholder='Search...' /></div>
      <div className="suggested">
        <h2>Suggested</h2>
        {loading && <Loading/>}
        {chatList.map((data) => {
          const user = data.user
          return (
            <label key={user.id} htmlFor={'user'+data.id} className="profileInfo">
              <div className="image"><img src={getUserImage(user)} alt="icon" /></div>
              <div className='info'>
                <h3>{user.username}</h3>
                <p>{user.name}</p>
              </div>
              <input onChange={(e)=>handleCheck(e, data.id)} type="checkbox" id={'user'+data.id}/>
            </label>
          )
        })}
      </div>

      <div className="message">
        <input ref={inputMessageRef} type="text" placeholder="Write a message..." /><br /><br />
        <button onClick={handleSharePost}>Send</button>
      </div>
    </div>
  );
};

export default PostShare;