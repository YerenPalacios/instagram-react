import { useDispatch } from 'react-redux';
import './simplePost.scss'
import React, { useEffect, useState } from 'react'
import icons from "../../icons"


export function SimplePost({ data, type = '' }: { data: Post, type?: string }) {
    const [fileUrl, setFileUrl] = useState(data.files && data.files[0]?.file);
  
    useEffect(() => {
      if (fileUrl && fileUrl.endsWith('.mp4')) {
        const tb = data.files && data.files[0]?.thumbnail
        setFileUrl(tb ?? '')
      }
    }, [fileUrl]);
  
    const dispatch = useDispatch();
  
    function setCurrentPost() {
      dispatch({
        type: "SET_CURRENT_POST",
        payload: data
      });
    }
  
    return (
      <div onClick={setCurrentPost} className={`simple-post ${type}`}>
        {fileUrl && <img loading='lazy' src={fileUrl} />}
        <div className="hover-data">
          <p>{icons.like_svg} {data.likes_count}</p>
          <p>{icons.comment} {data.comments_count}</p>
        </div>
      </div>
    );
  }
  