import './postWindow.scss'
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Post from '../../Post/post';
import PostShare from '../../Post/post-share/post-share';
import { LoginForm } from '../../form/loginForm';

export default function PostWindow() {
    const [hidden, setHidden] = useState(true);
    const { current_post } = useSelector((state: {current_post: Post}) => state);

    const dispatch = useDispatch();
    function cleanPost() {
        dispatch({
            type: "CLEAN_POST"
        })
    }

    useEffect(() => {
        setHidden(false)
    }, [current_post]);

    if (!current_post) { return null }
    if (hidden) return null

    return <div className="post-window">
        <Post type='small' data={current_post}></Post>
        <div onClick={()=>{setHidden(true); cleanPost()}} className="hidden-div"></div>
    </div>
}

export function SharingPostWindow() {
    const [hidden, setHidden] = useState(true);
    const { sharing_post } = useSelector((state: {sharing_post: Post}) => state);

    const dispatch = useDispatch();
    function cleanPost() {
        dispatch({
            type: "CLEAN_SHARING_POST"
        })
    }

    useEffect(() => {
        setHidden(false)
    }, [sharing_post]);

    if (!sharing_post) { return null }
    if (hidden) return null

    return <div className="post-window">
        <PostShare data={sharing_post}></PostShare>
        <div onClick={()=>{setHidden(true); cleanPost()}} className="hidden-div"></div>
    </div>
}

export function LoginWindow() {
    const [hidden, setHidden] = useState(true);
    const { login } = useSelector((state: {login: Post}) => state);

    const dispatch = useDispatch();
    function cleanPost() {
        dispatch({
            type: "CLEAN_LOGIN"
        })
    }

    useEffect(() => {
        setHidden(false)
    }, [login]);

    if (!login) { return null }
    if (hidden) return null

    return <div className="post-window">
        <LoginForm></LoginForm>
        <div onClick={()=>{setHidden(true); cleanPost()}} className="hidden-div"></div>
    </div>
}