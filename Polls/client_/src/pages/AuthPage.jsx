import React from 'react'
import {Link} from 'react-router-dom'
import ErrorMessage from '../components/ErrorMessage'
import Auth from '../components/Auth'

const AuthPage =({authType, isAuthenticated}) => {
    if(isAuthenticated) return <Link to="/" />
    return (
    <div>
        <h3>{authType}</h3>
        <Auth authType = {authType}/>
    </div>
    )
}

export default AuthPage