import React, { useEffect, useContext } from 'react'
import Post from '../components/Post/post'
import StoriesBar from '../components/home/storiesBar/storiesBar'
import './pages.scss'
import { useFetch } from '../helpers'
import Page from '../components/page/page'
import HomeSide from '../components/home/homeSide/HomeSide'
import { PostContext } from '../context/datacontext'

export default function Home() {
    const { get, loading } = useFetch()
    const { posts, setPosts } = useContext(PostContext)

    useEffect(() => {
        get('post/?priority=true').then(data =>
            setPosts(data)
        )
    }, [])

    return <Page>
        <div className="flexContainer">
            <div className="side_container">
                <StoriesBar />
                {loading && <p>cargando...</p>}
                {posts?.map((post: Post,) => (
                    <Post key={post.id} data={post} />
                ))}
            </div>
            <HomeSide />
        </div>
    </Page>

}