import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
    return (
        <div className="not-found">
            <h1>Esta página no está disponible.</h1>
            <p>Es posible que el enlace que seleccionaste esté roto o que se haya eliminado la página.</p>
            <Link to="/">Volver a Instagram.</Link>
        </div>
    )
}