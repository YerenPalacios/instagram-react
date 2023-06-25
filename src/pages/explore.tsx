import Page from "../components/page/page";
import React, { useContext, useEffect } from 'react'
import { PageContext, PostContext } from "../context/datacontext";
import { SimplePost } from "../components/Post/simplePost/simplePost";
import { useFetch } from "../helpers";

export default function Explore() {
    const { get } = useFetch()
    const { offset, limit } = useContext(PageContext)
    const { posts, setPosts } = useContext(PostContext);
    const withClasses = posts.map((item, index) => {
        if (index % 10 === 0) {
            return <SimplePost key={item.id} data={item} type='big' />
        } else if ((index + 3) % 10 === 0) {
            return <SimplePost key={item.id} data={item} type='big' />
        }

        return <SimplePost key={item.id} data={item} />
    })
    useEffect(() => {
        get(`post/?&limit=${limit}&offset=${offset}`).then((data: Post[]) =>
            setPosts(prev => {
                let a = [...prev]
                data.forEach(i => {
                    if (!a.find(item => item.id == i.id)) {
                        a.push(i)
                    }
                })
                return a
            })
        )
    }, [offset])

    return <Page>
        <div className="explore_container SimplePostContainer">
            {withClasses}
        </div>
    </Page>
}