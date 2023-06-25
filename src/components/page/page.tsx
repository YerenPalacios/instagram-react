import React, { ReactNode, useRef, useEffect, useContext } from 'react'
import Header from "../header/header";
import { PageContext } from '../../context/datacontext';

type PageProps = {
    children: ReactNode
}

export default function Page({ children }: PageProps) {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const { setOffset, limit } = useContext(PageContext)

    useEffect(() => {
        setOffset(0)
        containerRef.current?.addEventListener('scrollend', handleScrollEnd)
        return () => containerRef.current?.removeEventListener('scrollend', handleScrollEnd)
    }, [])

    const handleScrollEnd = () => {
        if (containerRef.current) {
          const { scrollTop, clientHeight, scrollHeight } = containerRef.current;
          const scrollPosition = scrollTop + clientHeight;
      
          const maxScrollPosition = scrollHeight;
          const tolerance = 5;
      
          const isAtBottom = scrollPosition >= maxScrollPosition - tolerance;
      
          if (isAtBottom) {
            setOffset(prev => prev + limit);
          }
        }
      }

    return <>
        <Header />
        <div ref={containerRef} className="container">
            {children}
        </div>
    </>

}