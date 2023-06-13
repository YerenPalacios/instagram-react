import Page from "../components/page/page";
import React, { useContext, useEffect } from 'react'
import { PostContext } from "../context/datacontext";
import { SimplePost } from "../components/Post/simplePost/simplePost";
import { useFetch } from "../helpers";

export default function Explore() {
    const { get } = useFetch()
    const { posts, setPosts } = useContext(PostContext);
    const withClasses = posts.map((item, index) => {
        if (index % 10 === 0) {
            return <SimplePost key={item.id} data={item} type='big' />
        } else if ((index + 3) % 10 === 0) {
            return <SimplePost key={item.id} data={item} type='big' />
        }

        return <SimplePost key={item.id} data={item} />
    })
    console.log(posts)

    useEffect(() => {
        get('post/?priority=true&limit=50').then(data =>
            setPosts(data)
        )
    }, [])

    return <Page><div className="explore_container SimplePostContainer">
        {withClasses}
    </div>

    </Page>
}