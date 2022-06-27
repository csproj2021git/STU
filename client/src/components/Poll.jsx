import React from "react"
import {connect} from 'react-redux'
import {vote} from '../store/actions/polls'

const Poll = ({poll, vote}) => {
    const answers = poll.options && poll.options.map(option => (
        <button onClick={() => vote(poll._id, {answer: option.option})} key={option._id}>{option.option}</button>
    ))

    // const data = {
    //     label: poll.options.map(option => option.option),
    //     datasets: [
    //         {
    //             label: poll.question,
    //             backgroundColor: poll.options.map(option => color()),
    //             borderColor: '#323643',
    //             data: poll.options.map(option => option.votes),
    //         }
    //     ]
    // }

    return (
        <div>
            <h3>{poll.question}</h3>
            <div>{answers}</div> 
        </div>
    )
}

export default connect(store => ({poll: store.currentPoll}), {vote})(Poll)