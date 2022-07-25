import axios from 'axios'

const host = "http://localhost:7001/api/course"

// sets header default token
const setToken = token => {
    if(token){
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else{
        delete axios.defaults.headers.common['Authorization']
    }
}


const call = async (method, path, data) => {
    const response = await axios["get"](`${host}`)
    return response.data
}

export default {call, setToken}