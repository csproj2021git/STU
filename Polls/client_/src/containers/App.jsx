import React from "react"
import {Provider} from 'react-redux'
import {store} from '../store'
import {setCurrentUser, addError, setToken, removeError} from '../store/actions'
import decode from 'jwt-decode'
import {BrowserRouter as Router} from 'react-router-dom'
import RouteViews from './RoutesViews'
import NavBar from './NavBar'
import ErrorMessage from "../components/ErrorMessage"

//When turning on app, it will check if user already logged in
if(localStorage.jwtToken){
    setToken(localStorage.jwtToken)
    try{
        store.dispatch(setCurrentUser(decode(localStorage.jwtToken)))
    }catch(err){
        store.dispatch(setCurrentUser({}))
        store.dispatch(removeError({}))
    }
}

const App = () => 
<Provider store = {store}>
    <Router>
        <div>
            <NavBar/>
            <RouteViews />
            <ErrorMessage/>
        </div>
    </Router>
</Provider>

export default App