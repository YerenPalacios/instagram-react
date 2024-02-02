import React from 'react'
import './profileInfo.scss'
import { useState } from "react"
import { getUserImage, useFetch } from "../../../helpers"
import { Link } from 'react-router-dom'

export function ProfileInfo({ data, className }: {data: User, className?: string}) {
    const { post, remove, loading } = useFetch()
    const [following, setFollowing] = useState(data.is_following)
    // TODO: origanize this big and small style
    const btnClass = className === "bigger" ? "commonButton" : "simpleButton"

    const handleFollow = () => {
        if (loading) return
        let body = { "following": data.id }
        if (!following)
            post('follow/', body).then(() => {
                setFollowing(true)
            })
        else
            remove('follow/', body).then(() => {
                setFollowing(false)
            })
    }
    // TODO: origanize this big and small style
    return <div className={className === "bigger" ? "profileInfo" : "profileInfo smaller"} >
        <div className="image"><img src={data.image ? data.image : getUserImage(data)} alt="icon" /></div>
        <div className='info'>
            <h3><Link to={"/" + data.username}>{data.username}</Link></h3>
            <p>{data.name}</p>
        </div>
        <button onClick={handleFollow} className={loading ? btnClass + " loadingBtn" : btnClass}>{following ? 'Unfollow' : 'Follow'}</button>
    </div>
}