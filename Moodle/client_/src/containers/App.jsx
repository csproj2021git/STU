import React from "react"
import {store} from '../store'
import {setCurrentUser, setToken, removeError} from '../store/actions'
import decode from 'jwt-decode'
import HomePage from "../pages/Homepage";

var username = 'Guest'

var createGuest = require("cross-domain-storage/guest");
var createHost = require("cross-domain-storage/host");
var storageHost = createHost([
  {
    origin: "http://localhost:7000",
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
    username = decode(localStorage.jwtToken)
    console.log(username)
    setToken(localStorage.jwtToken)
}

const App = () => {
return (
  <HomePage username = {username}/>
)
}

export default App