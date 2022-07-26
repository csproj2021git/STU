import React from "react";
import { Component } from "react";
import actions from "../actions/actions";

class Homepage extends Component{
    constructor(props){
        super(props)
        this.state = {
            username : props.username,
            courses : [],
            rooms : [],
            createCourseOpen: false,
            signOpen : false,
            courseOpen : false,

            signCourseNumber : '',
            createCourseNumber : '',
            createCourseName : '',
            createClassroomName : '',

            currentCourse : '',
            owner : false,

            errorMessage : '',
            statusOK : false,
        }
        this.signClick = this.handleSignClick.bind(this)
        this.createCourseClick = this.handleCreateCourseClick.bind(this)
        this.getCoursesClick = this.handleGetCoursesClick.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.courseClick = this.handleCourseClick.bind(this)
        this.createClassroom = this.handleCreateClassroom.bind(this)
        this.createCourse = this.handleCreateCourse.bind(this)
        this.sign = this.handleSign.bind(this)
    }
    async handleSign(e){
        this.setState({errorMessage : '', statusOK : false})
        try{
            const response = await actions.sign({number: this.state.signCourseNumber})
            if(response){
                this.setState({statusOK: true})
            }
            else{
                this.setState({errorMessage : 'Uh oh ... Youve made a mistake'})
            }
        }catch(err){
            this.setState({errorMessage : 'Uh oh ... Weve made a mistake'})
        }
        this.setState({signCourseNumber: ''})
    }

    async handleCreateCourse(e){
        this.setState({errorMessage : '', statusOK : false})
        try{
            const response = await actions.createCourse({number: this.state.createCourseNumber, name: this.state.createCourseName})
            if(response){
                this.setState({statusOK: true})
            }
            else{
                this.setState({errorMessage : 'Uh oh ... Youve made a mistake'})
            }
        }catch(err){
            this.setState({errorMessage : 'Uh oh ... Weve made a mistake'})
        }
        this.setState({createCourseNumber : '', createCourseName: ''})
    }


    async handleCreateClassroom(e){
        this.setState({errorMessage : '', statusOK : false})
        try{
            const response = await actions.createRoom({number: this.state.currentCourse, name: this.state.createClassroomName})
            if(response){
                this.setState({statusOK: true})
            }
            else{
                this.setState({errorMessage : 'Uh oh ... Youve made a mistake'})
            }
        }catch(err){
            this.setState({errorMessage : 'Uh oh ... Weve made a mistake'})
        }
        this.setState({createCourseNumber : '', createCourseName: ''})
    }

    async handleGetCoursesClick(e){
        this.setState({errorMessage : ''})
        if(this.state.courses.length){
            this.setState({courses: [], courseOpen : false})
        }
        else
        {
            try{
                const response = await actions.getUserCourses()
                this.setState({courses: response})
            }catch(err){
                this.setState({errorMessage : err})
            }
        }
    }

    handleChange(e){
        this.setState({[e.target.name]: e.target.value})
    }

    
    handleCreateCourseClick(e){
        this.setState({signOpen: false, courseOpen : false})
        this.state.createCourseOpen ? this.setState({createCourseOpen: false}) : this.setState({createCourseOpen: true})
        //actions.createCourse({number: "09876",name: "Ariel root sanda"})
    }

    handleSignClick(e){
        this.setState({createCourseOpen: false, courseOpen : false})
        this.state.signOpen ? this.setState({signOpen: false}) : this.setState({signOpen: true})
    }

    async handleCourseClick(number, user){
        this.setState({signOpen: false, createCourseOpen : false, courseOpen : true, currentCourse: number, errorMessage : '', owner : false})
        if(this.state.username.id === user){
            this.setState({owner: true})
        }
        try{
            const response = await actions.getCourseRooms({number: number})
            this.setState({rooms: response})
        }catch(err){
            this.setState({errorMessage : err})
        }
    }

    render(){
        const {signCourseNumber ,createCourseNumber, createCourseName, createClassroomName} = this.state
        const courses = this.state.courses.map(course => {return (<button id={course.number} onClick={() => this.courseClick(course.number, course.user)}>{`${course.name} ${course.number}`}</button>)} )
        const rooms = this.state.rooms.map(room => {return (<button className="link"id={room._id} onClick={() => {window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley"}}>{`${room.name}`}</button>)} )
        return(
            <div className="hero">
              <nav>
              <label id="name">Hello {this.state.username.username} </label>
                    <ul>
                        <label><button className="link"onClick={this.signClick}>Sign to course</button></label>&emsp;&emsp;
                        <label><button className="link" onClick={this.createCourseClick}>Create course</button></label>&emsp;&emsp;
                        <label><button className="link" onClick={(this.getCoursesClick)}>My courses</button></label>&emsp;&emsp;
                        <br></br><br></br>
                        {courses}

                        {this.state.createCourseOpen && 


                        <div>
                            <br></br><br></br>
                            <label>Course Number</label>
                            <br></br><br></br>
                            <input value={createCourseNumber} name="createCourseNumber" onChange={this.handleChange} autoComplete="off"></input>
                            <br></br><br></br>
                            <label>Course Name</label>
                            <br></br><br></br>
                            <input value={createCourseName} name="createCourseName" onChange={this.handleChange} autoComplete="off"></input>
                            <br></br><br></br><br></br>
                            <button onClick={this.createCourse}>submit</button>
                            <br></br><br></br><br></br>
                        </div>
                        }

                        {this.state.signOpen && 

                        <div>
                            <br></br><br></br>
                            <label>Course Number</label>
                            <br></br><br></br>
                            <input value={signCourseNumber} name="signCourseNumber" onChange={this.handleChange} autoComplete="off"></input>
                            <br></br><br></br><br></br>
                            <button onClick={this.sign}>submit</button>
                            <br></br><br></br><br></br>
                        </div>
                        }

                        {this.state.courseOpen && 

                        <div>
                            <br></br><br></br>
                            <label>My Classrooms</label>
                            <br></br><br></br>
                            {rooms}
                            <br></br><br></br>
                        </div>
                        }



                        {this.state.courseOpen && this.state.owner &&
                        <div>  
                            <label>Add Classroom</label>
                            <br></br><br></br>
                            <input value={createClassroomName} name="createClassroomName" onChange={this.handleChange} autoComplete="off"></input>
                            <br></br><br></br><br></br>
                            <button onClick={this.createClassroom}>submit</button>
                            <br></br><br></br><br></br>
                        </div>
                        }
                    </ul>
              </nav>
              <div className="errorMessage">
              {this.state.errorMessage}
              </div>
              <div className = "successMessage">
                {this.state.statusOK && "SUCCESS!"}
              </div>
            </div>
        )
    }
}



export default Homepage