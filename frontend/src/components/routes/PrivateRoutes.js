import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const PrivateRoutes = ({children}) => {
    const auth = useSelector(state => state.auth)
    

  return auth ? children : <Navigate to={'/'}/>
}

export default PrivateRoutes