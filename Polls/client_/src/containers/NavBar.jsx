import React from 'react'
import { Link } from 'react-router-dom'
import {connect} from 'react-redux'
import {logout} from '../store/actions'

const NavBar = ({auth, logout}) => {
    return(
    <div className='navbar'>
        {auth.isAuthenticated && <p>Hello {auth.user.username} </p>}
        <ul>
            {!auth.isAuthenticated &&<div>
            <li>
                <Link to='/register'>Register</Link>
            </li>
            <li>
                <Link to='/login'>Login</Link>
            </li>
            </div>
            }
            {auth.isAuthenticated &&
            <div>
            <li>
                <Link to='/poll/new'>Create poll</Link>
            </li>
            <li>
                <Link to='/' onClick={logout}>Logout</Link>
            </li>
            </div>
            }
        </ul>
    </div>
    )
}


export default connect(store => ({auth: store.auth}), {logout})(NavBar)