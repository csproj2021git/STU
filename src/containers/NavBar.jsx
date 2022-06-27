import React from 'react'
import { Link } from 'react-router-dom'
import {connect} from 'react-redux'
import {logout} from '../store/actions'

const NavBar = ({auth, logout}) => {
    return(
    <div className='navbar'>
        {auth.isAuthenticated && <p>Hello {auth.user.username} </p>}
        <ul>
            <li>
                <Link to='/'>Home page</Link>
            </li>
            <li>
                <Link to='/register'>Register</Link>
            </li>
            <li>
                <Link to='/login'>Login</Link>
            </li>
            <li>
                <Link to='/' onClick={logout}>Logout</Link>
            </li>
            <li>
                <Link to='/test'>Test page</Link>
            </li>
            <li>
                <Link to='/poll/new'>Create poll</Link>
            </li>
        </ul>
    </div>
    )
}


export default connect(store => ({auth: store.auth}), {logout})(NavBar)