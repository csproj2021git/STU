import React from "react";
import { Component } from "react";
import actions from "../actions/actions";
class Homepage extends Component{
    constructor(props){
        super(props)
        this.state = {
        }
        this.sign = this.handleSign.bind(this)
        this.createCourse = this.handleCreateCourse.bind(this)
    }

    handleCreateCourse(e){
        console.log("Create")
    }

    handleSign(e){
        actions.getCourses()
    }

    render(){
        return(
            <div className="hero">
            <title>STU Moodle</title>
              <nav>
              <h2 className="logo">Moodle<span>STU</span></h2>
                    <ul>
                        <li><button onClick={this.sign}>Sign to course</button></li>
                        <li><button onClick={this.createCourse}>Create course</button></li>
                    </ul>
              </nav>
              <div>
              <div className="content">
                        <h2 className="Student_details"> Student details:</h2>
                        <ul id="coursesList">
                            <li id="name">Name: </li>
                            <li id="id">ID: </li>
                        </ul>
                    </div>
                    <div className="courses">
                        <h2 className="courses_list"> Courses List:</h2>
                        <ul id="coursesList"></ul>
                    </div>
              </div>
            </div>
        )
    }
}

export default Homepage