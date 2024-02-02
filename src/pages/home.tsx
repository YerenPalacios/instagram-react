import React, { useEffect, useContext } from 'react'
import Post from '../components/Post/post'
import StoriesBar from '../components/home/storiesBar/storiesBar'
import './pages.scss'
import { useFetch } from '../helpers'
import Page from '../components/page/page'
import HomeSide from '../components/home/homeSide/HomeSide'
import { PageContext, PostContext } from '../context/datacontext'
import Loading from '../components/Base/loading/loading'

export default function Home() {
    const { get } = useFetch()
    const { posts, setPosts } = useContext(PostContext)
    const { offset, limit } = useContext(PageContext)

    useEffect(() => {
        get(`post/?priority=true&offset=${offset}&limit=${limit}`).then((data: Post[]) =>
            setPosts(prev => {
                const uniquePosts = [...prev];

                data.forEach(post => {
                    const isPostPresent = uniquePosts.some(existingPost => existingPost.id === post.id);
                    if (!isPostPresent) {
                        uniquePosts.push(post);
                    }
                });

                return uniquePosts;
            })
        )
    }, [offset])

    return <Page>
        <div className="flexContainer">
            <div className="side_container">
                <StoriesBar />
                {posts?.map((post: Post,) => (
                    <Post key={post.id} data={post} />
                ))}
                <Loading></Loading>
            </div>
            <HomeSide />
        </div>
    </Page>

}