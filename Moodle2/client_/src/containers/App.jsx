import React from "react"
import {store} from '../store'
import {setCurrentUser, setToken, removeError} from '../store/actions'
import decode from 'jwt-decode'
import HomePage from "../pages/Homepage";

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

const App = () => {
return (
  <HomePage />
)
}

export default App