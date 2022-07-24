import React from "react"
import {Redirect} from "react-router-dom"
import CreatePoll from "../components/CreatePoll"
const CreatePollPage = ({isAuthenticated}) => {
    if (!isAuthenticated) return <Redirect to='/login'/>
    return(
        <div>
            <CreatePoll/>
        </div>
    )
}

export default CreatePollPage