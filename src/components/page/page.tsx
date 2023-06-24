import React, { ReactNode } from 'react'
import Header from "../header/header";

export default function Page({children}: {children: ReactNode}){
    return (
        <>
            <Header />
            <div className="container">
                {children}
            </div>
        </>
    )
}