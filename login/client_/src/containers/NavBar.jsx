import React from 'react'
import { Link } from 'react-router-dom'
import {connect} from 'react-redux'
import {logout} from '../store/actions'

const NavBar = ({auth, logout}) => {
    return(
    <div className='navbar'>
        <label>
        {auth.isAuthenticated && <p>Hello {auth.user.username} </p>}
        </label>
        <ul>
            {!auth.isAuthenticated && <div>
                <label>
                    <Link className="link" style={{ textDecoration: 'none' }} to='/register'>Register</Link>&emsp;&emsp;
                </label>
                <label>
                    <Link className="link" style={{ textDecoration: 'none' }} to='/login'>Login</Link>&emsp;&emsp;
                    </label>
                </div>
            }
            {auth.isAuthenticated &&
            <label>
                <Link className="link" to='/' onClick={logout}>Logout</Link>
                </label>
            }
        </ul>
    </div>
    )
}


export default connect(store => ({auth: store.auth}), {logout})(NavBar)