import React from 'react'
import {Link} from 'react-router-dom'
import Auth from '../components/Auth'

const AuthPage =({authType, isAuthenticated}) => {
    if(isAuthenticated) return <Link to="/" />
    return (
    <div>
        <Auth authType = {authType}/>
    </div>
    )
}

export default AuthPage