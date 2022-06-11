import React from 'react'
import {Link} from 'react-router-dom'
import ErrorMessage from '../components/ErrorMessage'
import Auth from '../components/Auth'

const AuthPage =({authType, isAuthenticated}) => {
    if(isAuthenticated) return <Link to="/" />
    return (
    <div>
        <Auth authType = {authType}/>
        <ErrorMessage />
    </div>
    )
}

export default AuthPage