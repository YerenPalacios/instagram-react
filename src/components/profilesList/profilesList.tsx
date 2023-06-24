import React from 'react'
import { useState, useEffect } from "react";
import { useFetch } from "../../helpers";
import { ProfileInfo } from "../shared/profileInfo/profileInfo";

export default function ProfilesList({ limit = null }: {limit?: number | null}) {
    const { get } = useFetch()
    const [users, setUsers] = useState([])

    useEffect(() => {
        let page_size = limit ? `page_size=${limit}` : ''
        get('user/?' + page_size).then(data => {
            setUsers(data.map((i: User) => <ProfileInfo style='bigger' key={i.id} data={i} />))
        })
    }, [])

    return <div className="explorePeopleContainer">
        <h4>Suggested</h4>
        <div className="users">
            {users}
        </div>
    </div>
}