import './ApiErrorModal.scss'
import React from 'react'
import { useEffect, useContext } from 'react';
import { ApiErrorContext } from '../../context/datacontext';

interface NotificationColorsInterface {
  [key: string]: string
}

const NotificationColors: NotificationColorsInterface = {
  'error': '#c11',
  'success': '#1c1'
}


export function APIErrorModal() {
  const modalDuration: number = 5
  const errorContext = useContext(ApiErrorContext)

  useEffect(() => {
    if (errorContext.error)
      setTimeout(() => {
        errorContext.setError("")
      }, modalDuration * 1200);
  }, [errorContext])

  const close = ()=>{
    errorContext.setError("")
  }

  if (!errorContext.error) return null
  console.log(NotificationColors[errorContext.type])
  return <div style={{ animationDuration: modalDuration + 's', color: NotificationColors[errorContext.type]}} className='ApiErrorModal'>
    <div onClick={close}>x</div>
    <span style={{backgroundColor: NotificationColors[errorContext.type]}}></span>
    {errorContext.error}
  </div>
}