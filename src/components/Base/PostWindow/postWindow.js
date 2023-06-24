import './postWindow.scss'
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Post from '../../Post/post';
import PostShare from '../../Post/post-share/post-share';

export default function PostWindow() {
    const [hidden, setHidden] = useState(true);
    const { current_post } = useSelector((state) => state);

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
    const { sharing_post } = useSelector((state) => state);

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
        <PostShare type='small' data={sharing_post}></PostShare>
        <div onClick={()=>{setHidden(true); cleanPost()}} className="hidden-div"></div>
    </div>
}