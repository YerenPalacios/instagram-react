import './search.scss'
import { getUserImage, useFetch } from '../../helpers'
import React, { ChangeEvent, MouseEvent, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Search() {
    const { get, loading } = useFetch()
    const [users, setUsers] = useState<User[]>([]);

    const handleSearch = ({ target }: ChangeEvent<HTMLInputElement>) => {
        let value = target.value
        get('user/?search=' + value).then(
            data => setUsers(data)
        )
    }

    const handleClick= ({target}: MouseEvent<HTMLElement>)=>{
        //TODO: send to recent search
        // console.log(target.dataset.id)
    }

    return <div className='search'>
        <div className='search-head'>
            <h1>Search</h1>
            <input onInput={handleSearch} type="text" placeholder='Search'/>
        </div>

        {!users.length && !loading &&
            <div className='no-data'>
                <h3>Recent</h3>
                <p>No recent searches.</p>
            </div>
        }
        {loading &&
            <div className='loading'>
                <span className="loader"></span>
            </div>
        }

        {users &&
            <div className="users">
                {users.map(
                    user =>
                        <Link data-id={user.id} key={user.id} onClick={handleClick} to={`/${user.username}`} className='user'>
                            <div className="image">
                                <img src={getUserImage(user)} alt="" />
                            </div>
                            <div>
                                <b>{user.name}</b>
                                {user.username}
                            </div>

                        </Link>
                )}
            </div>
        }


    </div>
}