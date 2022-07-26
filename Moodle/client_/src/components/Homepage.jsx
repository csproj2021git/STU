import React from "react";
import { Component } from "react";
import { useState } from "react";
import actions from "../actions/actions";


class Homepage extends Component{
    constructor(props){
        super(props)
        this.state = {
            username : props.username,
            courses : '',
        }
        this.sign = this.handleSign.bind(this)
        this.createCourse = this.handleCreateCourse.bind(this)
        this.test = this.handleTest.bind(this)
        this.getCourses = this.handleGetCourses.bind(this)
    }
    handleTest(e){
        actions.getCourseRooms({number: "09876"})
    }

    async handleGetCourses(e){
        try{
            let _courses = ''
            const response = await actions.getCourses()
            response.forEach(element => {
                _courses += `Course number: ${element.number}\t\tCourse name: ${element.name}\n`
                console.log(_courses)
            });
            this.setState({courses: _courses})

        }catch(err){
        }
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
              <nav>
              <label id="name">Hello {this.state.username} </label>
                    <ul>
                        <label><button className="link"onClick={this.sign}>Sign to course</button></label>&emsp;&emsp;
                        <label><button className="link" onClick={this.createCourse}>Create course</button></label>&emsp;&emsp;
                        <label><button className="link" onClick={this.test}>Self destruct</button></label>&emsp;&emsp;
                        <label><button className="link" onClick={(this.getCourses)}>My courses</button></label>&emsp;&emsp;
                    </ul>
              </nav>
            </div>
        )
    }
}



export default Homepage