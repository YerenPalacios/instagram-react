import './ImageSlider.scss'
import React, { useRef, useState, useEffect } from 'react'
// import SimpleImageSlider from 'react-simple-image-slider'
import chevron from './../../../assets/right-chevron.png'


function PostFile({ file }: { file: PostFile }) {
    const videoRef = useRef<HTMLVideoElement | null>(null)
    const [playButtonStatus, setPlayButtonStatus] = useState(true)
    const [showingTb, setShowingTb] = useState(true)

    const handleClick = () => {
        if (videoRef.current) {
            videoRef.current.paused ? videoRef.current.play() : videoRef.current.pause()
        }
    }

    const onPlay = () => {
        setShowingTb(false)
        setPlayButtonStatus(false)
    }
    const onPause = () => {
        setPlayButtonStatus(true)
    }

    if (file.file.endsWith('.mp4')) {
        return <div className='post-file'>
            <button onClick={handleClick} style={{ opacity: playButtonStatus ? 1 : 0 }}>▲</button>
            <video ref={videoRef} onPlay={onPlay} onPause={onPause} src={file.file}></video>
            {showingTb && <img className='thumbnail' src={file.thumbnail} alt="" />}
        </div>
    }
    return <div className='post-file'><img src={file.file} alt="" /></div>
}

export default function ImageSlider({ images }: { images: PostFile[] }) {
    const [current, setCurrent] = useState(0)
    const [scrollLeft, setScrolLeft] = useState(0)

    const sliderRef = useRef<HTMLDivElement | null>(null)


    const handleNext = () => {
        setScrolLeft(prev => {
            if (sliderRef.current) {
                const newScrollLeft = prev + sliderRef.current.clientWidth
                if (newScrollLeft >= sliderRef.current.scrollWidth - sliderRef.current.clientWidth + 5) {
                    return prev
                }
                setCurrent(prev => prev + 1)
                return newScrollLeft
            }
            return 0
        })
    }
    const handlePrev = () => {
        setScrolLeft(prev => {
            if (sliderRef.current) {
                const newScrollLeft = prev - sliderRef.current.clientWidth
                if (newScrollLeft < 0) {
                    return prev
                }
                setCurrent(prev => prev - 1)
                return newScrollLeft
            }
            return 0
        })
    }

    useEffect(() => {
        if (sliderRef.current) {
            sliderRef.current.scrollTo(scrollLeft, 0)
        }
        console.log(images)
    }, [scrollLeft])

    return <section className='slider'>
        <section ref={sliderRef}>
            <article style={{ width: images.length + '00%' }} id={'article' + images.length} >
                {images.map((i, k) => <PostFile file={i} key={k} />)}
            </article>
        </section>
        {images.length > 1 && <>
            <button className="scrollButton" style={{ display: current === 0 ? 'none' : 'block' }} onClick={handlePrev}><img src={chevron} alt="" /></button>
            <button className="scrollButton" style={{ display: current === images.length - 1 ? 'none' : 'block' }} onClick={handleNext}><img src={chevron} alt="" /></button>
            <div className="scrollButtons">
                {images.map((i, k) => {
                    let itemName = ''
                    if (k === current) itemName = 'active'
                    return <button className={itemName} key={k}></button>
                })}
            </div>
        </>}

    </section>
    // return <div className="image-slider">
    //     {images.length === 1 ?
    //         <SimpleImageSlider
    //             width={896}
    //             height={504}
    //             images={images}
    //             showBullets={false}
    //             showNavs={false}
    //         /> : images.length > 1 &&
    //         <SimpleImageSlider
    //             width={896}
    //             height={504}
    //             images={images}
    //             showBullets={true}
    //             showNavs={true}
    //         />
    //     }
    // </div>
}