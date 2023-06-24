import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../../context/datacontext';
import './HomeSide.scss'
import { Link } from 'react-router-dom';
import { getUserImage, useFetch } from '../../../helpers';
import { ProfileInfo } from '../../shared/profileInfo/profileInfo';

export default function HomeSide() {
    const { auth } = useContext(AuthContext);

    const [users, setUsers] = useState([])
    const { get } = useFetch()

    useEffect(() => {
        get('user/').then(data => {
            setUsers(data?.map((i: User) => <ProfileInfo key={i.id} data={i} />))
        })
    }, [])

    return <div className="homeSide">
        <div className="profileInfo">
            <div className="image"><img src={auth && getUserImage(auth.user)} alt="icon" /></div>
            <div className='info'>
                <h3><Link to={"/" + auth?.user.username}>{auth?.user.username}</Link></h3>
                <p>{auth?.user.name}</p>
            </div>
            <button className="simpleButton">Switch</button>
        </div>
        <div className="suggestion"><p>Sugerencias para ti</p><Link to='/explore/people' className="simpleButton">Ver todos</Link></div>
        {users}
    </div>
}