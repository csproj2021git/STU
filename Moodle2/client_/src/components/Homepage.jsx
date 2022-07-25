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
        this.test = this.handleTest.bind(this)
    }

    handleTest(e){
        actions.getCourseRooms({number: "09876"})
    }

    handleCreateCourse(e){
        actions.createCourse({number: "09876",name: "Ariel root sanda"})
    }

    handleSign(e){
        actions.sign("...") //TODO - Get course number from form
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
                        <li><button onClick={this.test}>Self destruct</button></li>
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