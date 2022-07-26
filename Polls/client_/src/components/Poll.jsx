import React from "react"
import {connect} from 'react-redux'
import {vote} from '../store/actions/polls'
const Poll = ({poll, auth, vote}) => {
    const answers = poll.options && poll.options.map(option => (
        <button onClick={() => {
            vote(poll._id, {answer: option.option})
        }
    } 
    key={option._id}>{option.option}</button>
    ))
    try{
        var data = auth.user.id === poll.user._id && poll.options.map((votes) => (
            <div>
                <label>Number of votes: {votes.votes}</label>   
            </div>
        ))
    }catch(err){

    }
    return (
        <div>
            <label>Question: <br></br><br></br>{poll.question}<br></br><br></br></label>
            <div><label>Answers: <br></br><br></br>{answers}</label></div>
            <div><br></br><br></br>{data}</div> 
        </div>
    )
}

export default connect(store => ({poll: store.currentPoll, auth: store.auth}), {vote})(Poll)