import React, { Component, Fragment } from "react"
import { connect } from "react-redux"
import { createPoll } from "../store/actions/polls"

class CreatePoll extends Component{
    constructor(props){
        super(props)
        this.state = {
            question: '',
            options: ['']
        }
        this.addAnswer = this.addAnswer.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleAnswer = this.handleAnswer.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    addAnswer(){
        this.setState({options: [...this.state.options,'']})
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value})
    }

    handleSubmit(e){
        e.preventDefault()
        this.props.createPoll(this.state)
        //window.location.replace("/");
    }

    handleAnswer(e, index){
        const options = [...this.state.options]
        options[index] = e.target.value
        this.setState({options})
    }
    
    render(){

        const options = this.state.options.map((option, index) => <Fragment key={index}>
            <label>option</label>
            <input type="text" value={option} onChange={e => this.handleAnswer(e, index)}/>
        </Fragment>)

        return (
            <form onSubmit={this.handleSubmit}>
                <label htmlFor="question">Question</label>
                <input type='text' name='question' value={this.state.question} onChange={this.handleChange} />
                {options}
                <button type='button' onClick={this.addAnswer}>Add options</button>
                <button type='submit'>Submit</button>
            </form>
        )
    }
}

export default connect(() => ({}),{createPoll})(CreatePoll)