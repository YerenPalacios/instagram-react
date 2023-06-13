import icon from './new-post.png'
import './newPost.scss'
import React, { useState, useContext, FormEvent, ChangeEvent } from 'react';
import { getUserImage, useFetch } from '../../helpers';
import { useTranslation } from 'react-i18next'
import { default as ico } from '../icons'
import SimpleImageSlider from 'react-simple-image-slider'
import { AuthContext, PostContext } from '../../context/datacontext';


function getBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result);
            } else {
                reject()
            }
        }
        reader.onerror = error => reject(error);
    });
}


export default function NewPost({ hide }: { hide: Function }) {
    const { t } = useTranslation()
    const { post } = useFetch()
    const [addingMedia, setAddingMedia] = useState(true)
    const [actualMedia, setActualMedia] = useState<{ url: string }[]>([])
    const [publishing, setPublishing] = useState(false)
    const { auth } = useContext(AuthContext)
    const { posts, setPosts } = useContext(PostContext)
    const [data, setData] = useState<{ images: string[], text: string }>({
        images: [],
        text: ""
    })

    const handleAddFile = ({ target }: { target: HTMLInputElement | { files: FileList } }) => {
        // TODO: remember how to send images :u
        const files = Array.from(target.files ?? [])
        const images: string[] = data.images
        const preview: { url: string }[] = []

        files.forEach(i => {
            preview.push({ url: URL.createObjectURL(i) })

            getBase64(i).then((data: string) => {
                images.push(data)
            }
            )
        })

        setData({ ...data, images: images });
        setActualMedia(preview)

        setAddingMedia(false)
        setPublishing(true)
    }

    const handleChange = ({ target }: ChangeEvent<HTMLTextAreaElement>) => {
        setData({ ...data, text: target.value })
    }

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        post('post/').then((postItem: Post) => {
            setPosts([postItem, ...posts])
        })
    }


    document.addEventListener('paste', function (event) {
        var items = event.clipboardData && event.clipboardData.items;
        if (items) {
            let first_item = items[0]
            if (first_item.type.includes('image')) {
                let file = first_item.getAsFile()
                if (file) {
                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(file);

                    const fileList: FileList = dataTransfer.files;

                    handleAddFile({ target: { files: fileList } });
                }
            }
        }
    });

    return (
        <div className="new-post-div">
            <div onClick={() => hide(!true)} className="close-item"></div>
            {addingMedia ?
                <div className="new-post">
                    <h1>{t('Create a new post')}</h1>
                    <div>
                        <img src={icon} alt="add photo" />
                        <p>Arrastra las fotos y los videos aquí</p>
                        <input onChange={handleAddFile} type="file" id="images" accept="image/png, image/jpeg" multiple />
                        <label htmlFor='images'>seleccionar de la computadora</label>
                    </div>
                </div>
                :
                <div className="new-post">
                    <h1>Crea una nueva publicación <label htmlFor="send">Compartir</label></h1>
                    <form onSubmit={handleSubmit} className='form'>
                        <div className="actual-media">
                            <SimpleImageSlider
                                width={296}
                                height={304}
                                images={actualMedia}
                                showBullets={true}
                                showNavs={true}
                            />
                        </div>
                        <div className="form-data">
                            <div className="user">
                                <img src={auth ? getUserImage(auth.user) : undefined} alt="" />
                                <p>{auth?.user.username}</p>
                            </div>
                            <textarea
                                onChange={handleChange}
                                placeholder="Escribe una descripcion"
                                name="desc" id="" cols={30} rows={10}></textarea>
                            <input style={{ display: 'none' }} type="submit" id="send" value="Send" />
                            <button style={{ opacity: .5 }} type="button">{ico.face}</button>
                        </div>
                    </form>
                </div>
            }

        </div>
    )
}