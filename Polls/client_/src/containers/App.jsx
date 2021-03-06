import React from "react"
import { useState } from "react";
import {Provider} from 'react-redux'
import {store} from '../store'
import {setCurrentUser, setToken, removeError} from '../store/actions'
import decode from 'jwt-decode'
import {BrowserRouter as Router} from 'react-router-dom'
import RouteViews from './RoutesViews'
import NavBar from './NavBar'
import ErrorMessage from "../components/ErrorMessage"

var createGuest = require("cross-domain-storage/guest");
var createHost = require("cross-domain-storage/host");
var storageHost = createHost([
  {
    origin: "http://localhost:4000",
    allowedMethods: ["get", "set", "remove"], 
  },
]);//<--- First add yourself then others, you MUST add yourself, this tells us who is allowed to reach us and with what methods

var remoteStorage = createGuest("http://localhost:5000"); // <--- Who we want to be guests of

remoteStorage.get("jwtToken", function (error, value) {
    if(value && !localStorage.jwtToken){
      localStorage.setItem('jwtToken', value)
      window.location.href = '/'
    }
  });

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
return (<Provider store = {store}>
    <Router>
        <div>
            <NavBar/>
            <RouteViews />
            <ErrorMessage/>
        </div>
    </Router>
</Provider>)
}

export default App