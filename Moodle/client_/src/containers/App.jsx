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
    if(value){
      localStorage.setItem('jwtToken', value)
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
return (
<div class="hero">
<head>
<title>STU Moodle</title>
    <link rel="preconnect" href="https://fonts.gstatic.com" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" integrity="sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <link rel="stylesheet" href="styles/style.css" />
</head>
  <nav>
  <h2 class="logo">Moodle<span>STU</span></h2>
        <ul>
            <li><button onclick="addExistCourse()">Add an existing course</button></li>
            <li><button onclick="addNewCourse()">Create a new course</button></li>
        </ul>
  </nav>
  <div>
  <div class="content">
            <h2 class="Student_details"> Student details:</h2>
            <ul id="coursesList">
                <li id="name">Name: </li>
                <li id="id">ID: </li>
            </ul>
        </div>
        <div class="courses">
            <h2 class="courses_list"> Courses List:</h2>
            <ul id="coursesList"></ul>
        </div>
  </div>
</div>
)
}

export default App