import { default as ico } from '../icons'
import './header.scss'
import React, { useState, useRef, ReactElement } from 'react';
import { Link, useLocation, } from 'react-router-dom';
import NewPost from '../newPost/newPost';
import Search from '../search/search';
import Notifications from './notifications/notifications';
import UserMenu from './usermenu'


export default function Header() {
    const [showNewPostDiv, setShowNewPostDiv] = useState(false);
    const [currentTab, setCurrentTab] = useState<ReactElement>();
    const header = useRef<HTMLDivElement | null>(null)

    const changeTab = (component: ReactElement) => {
        if (currentTab?.type === component?.type) {
            header.current?.classList.remove('without_labels')
            setCurrentTab(undefined)
        } else {
            header.current?.classList.add('without_labels')
            setCurrentTab(component)
        }
    }
    return (
        <header ref={header}>
            <div className='logo'>{header.current?.className === 'without_labels' ? ico.ig : ico.logo}</div>
            <div className='logosm'>{ico.ig}</div>
            <div className="icons">
                <Icon ico={ico.home} label={'Home'} type='link' to='/' />
                <Icon ico={ico.search} label={'Search'} onClick={() => changeTab(<Search />)} />
                <Icon ico={ico.share} label={'Messages'} type='link' to='/inbox' />
                <Icon className="create" ico={ico.add} label={'Create'} onClick={() => setShowNewPostDiv(true)} />
                <Icon ico={ico.find} label={'Explore'} type='link' to='/explore' />
                <Icon className="notificationsbutton" ico={ico.like_svg} label={'Notifications'} onClick={() => changeTab(<Notifications />)} />
                <UserMenu />
            </div>
            {showNewPostDiv && <NewPost hide={setShowNewPostDiv}></NewPost>}
            {currentTab && <div className='extra_div'>
                {currentTab}
            </div>}

        </header>
    )
}

type IconParams = { 
    ico: JSX.Element,
    label: string,
    type?: string,
    to?: string,
    onClick?: ()=>void | null
    className?: string
}

function Icon({ ico, label, type = 'button', to = '/', onClick, className}: IconParams) {
    const location = useLocation()
    const getCurrent = (e: string) => {
        if (location.pathname === e) return 'current'
    }
    switch (type) {
        case 'link':
            return <Link className={getCurrent(to) + " " + className} to={to}>{ico} <span>{label}</span></Link>

        default:
            return <button className={className} onClick={onClick}>{ico} <span>{label}</span></button>
    }
}