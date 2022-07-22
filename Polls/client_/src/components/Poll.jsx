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
        console.log(data)
    }catch(err){

    }
    return (
        <div>
            <h3>{poll.question}</h3>
            <div>{answers}</div>
            <div>{data}</div> 
        </div>
    )
}

export default connect(store => ({poll: store.currentPoll, auth: store.auth}), {vote})(Poll)