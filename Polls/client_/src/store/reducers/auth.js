import {SET_CURRENT_USER} from '../actionsTypes'

const DEFAULT_STATE = {
    user: {},
    isAuthenticated: false,
}

const auth = (state = DEFAULT_STATE, action) => {
    switch(action.type){
        case SET_CURRENT_USER:
            return{
                isAuthenticated: !!Object.keys(action.user).length,
                user: action.user,
            }
        default:
            return state
    }
}

export default auth