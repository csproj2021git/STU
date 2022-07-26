import {SET_POLLS,SET_CURRENT_POLL} from '../actionsTypes'
import {addError, removeError} from './error'
import api from '../../services/api'

export const setPolls = polls => ({
    type: SET_POLLS,
    polls
})

export const setCurrentPoll = poll => ({
    type: SET_CURRENT_POLL,
    poll
})

export const getPolls = () => {
    return async dispatch => {
        try{
            const polls = await api.call('get', 'polls')
            dispatch(setPolls(polls))
            dispatch(removeError())
        }catch (err){
            const error = err.response.data
            dispatch(addError(error.err))
        }
    }
}

export const getUserPolls = () => {
    return async dispatch => {
        try{
            const polls = await api.call('get', 'polls/user')
            dispatch(setPolls(polls))
            dispatch(removeError())
        }catch (err){
            const error = err.response.data
            dispatch(addError(error.err))
        }
    }
}

export const createPoll = (data) => {
    return async dispatch => {
        try{
            const poll = await api.call('post', 'polls', data)
            console.log(`polls: ${JSON.stringify(poll._id)}`)
            dispatch(setCurrentPoll(poll))
            dispatch(removeError())
        }catch (err){
            const error = err.response.data
            dispatch(addError(error.err))
        }
    }
}

export const getCurrentPoll = (id) => {
    return async dispatch => {
        try{
            const poll = await api.call('get', `polls/${id}`)
            dispatch(setCurrentPoll(poll))
            dispatch(removeError())
        }catch (err){
            const error = err.response.data
            dispatch(addError(error.err))
        }
    }
}

export const vote = (id,data) => {
    return async dispatch => {
        try{
            const poll = await api.call('post', `polls/${id}`, data)
            dispatch(setCurrentPoll(poll))
            dispatch(removeError())
            window.location.reload()
        }catch (err){
            const error = err.response.data
            dispatch(addError(error.err))
        }
    }
}