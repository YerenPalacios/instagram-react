import { useDispatch } from 'react-redux';
import './simplePost.scss'
import React from 'react'
import icons from "../../icons"


export function SimplePost({ data, type='' }:{data: Post, type?: string}) {
    const dispatch = useDispatch();
    function setCurrentPost() {
        dispatch({
            type: "SET_CURRENT_POST",
            payload: data
        })
    }
    return (
        <div onClick={setCurrentPost} className={`simple-post ${type}`}>
            <img loading='lazy' src={data.images && data.images[0].image} />
            <div className="hover-data">
                <p>{icons.like_svg} {data.likes_count}</p>
                <p>{icons.comment} {data.comments_count}</p>
            </div>
        </div>
    )
}