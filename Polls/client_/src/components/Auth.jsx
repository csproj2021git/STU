import React, {Component} from "react"
import {connect} from 'react-redux'
import {authUser, logout} from '../store/actions'

class Auth extends Component{
    constructor(props){
        super(props)
        this.state = {
            username: '',
            password: '',
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value})
    }

    handleSubmit(e) {
        const {username, password} = this.state
        const {authType} = this.props
        e.preventDefault()
        this.props.authUser(authType || 'login', {username,password})
    }

    render(){
        const {username, password} = this.state
        const {authType} = this.props
        return(
        <div>
            <br></br><br></br><br></br><br></br>
            {authType == "login" ? <label>Login</label> : <label>Register</label>}
            <form onSubmit={this.handleSubmit}>
                <br></br><br></br>
                <label htmlFor="username">Username</label>
                <br></br><br></br>
                <input type="text" value={username} name="username" onChange={this.handleChange} autoComplete="off"></input>
                <br></br><br></br>
                <label htmlFor="password">Password</label>
                <br></br><br></br>
                <input type="password" value={password} name="password" onChange={this.handleChange} autoComplete="off"></input>
                <br></br><br></br><br></br>
                <button>submit</button>
                <br></br><br></br><br></br>
            </form>
            
        </div>
        )
    }
}

export default connect(() => ({}), {authUser, logout})(Auth)