import React, {Component} from "react";
import {connect} from 'react-redux'
import {getPolls,getUserPolls, getCurrentPoll} from '../store/actions/polls'


class Polls extends Component{

    constructor(props){
        super(props)
        this.handleSelect = this.handleSelect.bind(this)
    }

    componentDidMount(){
        const {getPolls} = this.props
        getPolls()
    }

    handleSelect(id){
        const {history} = this.props
        history.push(`/poll/${id}`)
    }

    render(){
        const {auth, getPolls, getUserPolls} = this.props
        const polls = this.props.polls.map(poll => (
                <li key={poll._id} onClick={() => this.handleSelect(poll._id)}>{poll.question}</li>
            )
        )
        return (
            <div>
                {auth.isAuthenticated &&(
                    <div>
                        <button onClick={getPolls}>All polls</button>
                        <button onClick={getUserPolls}>My polls</button>
                    </div>
                )}
                <ul>{polls}</ul>
            </div>
        )
    }
}

export default connect(store => ({auth: store.auth, polls: store.polls}),{getPolls, getUserPolls, getCurrentPoll})(Polls)