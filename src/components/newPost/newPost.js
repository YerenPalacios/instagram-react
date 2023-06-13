import icon from './new-post.png'
import './newPost.scss'
import { useState, useContext } from 'react';
import { getToken, getUserImage, getUserSesion } from '../../helpers';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'
import api from './../../api.json'
import { default as ico } from './../icons'
import SimpleImageSlider from 'react-simple-image-slider'
import { AuthContext, PostContext } from '../../context/datacontext';
import Post from '../Post/post';


function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}


export default function NewPost({ hide }) {
    const { t } = useTranslation()
    const [addingMedia, setAddingMedia] = useState(true)
    const [actualMedia, setActualMedia] = useState([])
    const [publishing, setPublishing] = useState(false)
    const {auth} = useContext(AuthContext)
    const { posts, setPosts } = useContext(PostContext)
    const [data, setData] = useState({
        images: [],
        text: ""
    })

    const handleAddFile = ({ target }) => {
        // TODO: remember how to send images :u
        const files = Array.from(target.files)
        const images = data.images
        const preview = []

        files.forEach(i => {
            preview.push({ url: URL.createObjectURL(i) })

            getBase64(i).then(
                data => images.push(data)
            )
        })

        setData({ ...data, images: images });
        setActualMedia(preview)

        setAddingMedia(false)
        setPublishing(true)
    }

    const handleChange = ({ target }) => {
        setData({ ...data, text: target.value })
    }

    const handleSubmit = (e) => {
        //something weird...
        e.preventDefault()
        createPost()
    }

    const createPost = () => {
        // TODO: separate fetch in a function with catch errors 
        hide(!true)
        fetch(api.url + 'post/', {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).then(res => res.json())
            .then(data => {
                setPosts([<Post key={data.id} data={data}/>, ...posts])
            })
            .catch(error => console.log(error))
    }


    document.addEventListener('paste', function (event) {
        var items = event.clipboardData && event.clipboardData.items;
        if (items) {
            let first_item = items[0]
            if (first_item.type.includes('image')) {
                let file = first_item.getAsFile()
                handleAddFile({ target: { files: [file] } })
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
                                <img src={getUserImage(auth.user)} alt="" />
                                <p>{auth.user.username}</p>
                            </div>
                            <textarea
                                onChange={handleChange}
                                placeholder="Escribe una descripcion"
                                name="desc" id="" cols="30" rows="10"></textarea>
                            <input style={{ display: 'none' }} type="submit" id="send" value="Send" />
                            <button style={{ opacity: .5 }} type="button">{ico.face}</button>
                        </div>
                    </form>
                </div>
            }

        </div>
    )
}