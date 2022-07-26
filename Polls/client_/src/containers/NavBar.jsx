import React from 'react'
import { Link } from 'react-router-dom'
import {connect} from 'react-redux'
import {logout} from '../store/actions'

const NavBar = ({auth, logout}) => {
    return(
    <div className='navbar'>
        {auth.isAuthenticated && <label>Hello {auth.user.username} </label>}
        <ul>
            {!auth.isAuthenticated &&<div>
            <label>
                <Link className="link"style={{ textDecoration: 'none' }} to='/register'>Register</Link>&emsp;&emsp;
            </label>
            <label>
                <Link className="link" style={{ textDecoration: 'none' }} to='/login'>Login</Link>&emsp;&emsp;
            </label>
            </div>
            }
            {auth.isAuthenticated &&
            <div>
                 <label>
                <Link className="link" style={{ textDecoration: 'none' }} to='/poll/new'>Create poll</Link>&emsp;&emsp;
                </label>
            <label>
                <Link className="link" style={{ textDecoration: 'none' }} to='/' onClick={logout}>Logout</Link>&emsp;&emsp;
            </label>
            </div>
            }
        </ul>
    </div>
    )
}


export default connect(store => ({auth: store.auth}), {logout})(NavBar)