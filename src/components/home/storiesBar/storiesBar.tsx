import './storiesBar.scss'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import { getUserImage, useFetch } from '../../../helpers'

export default function StoriesBar() {
    const [profiles, setProfiles] = useState<User[]>([])
    const { get, loading } = useFetch()

    useEffect(() => {
        get('profile-stories/').then(data => {
            setProfiles(data)
        })
    }, [])

    if (profiles.length !== 0) {
        return (
            <div className="stories_bar">
                {loading && <p>loading...</p>}
                {profiles.map((p, i) => (
                    <div key={i} className="profile">
                        <div className="image"><img src={getUserImage(p)} alt="" /></div>
                        <p><Link to={"/" + p.username}>{p.username}</Link></p>
                    </div>
                ))}
            </div>
        )
    } else return null

}