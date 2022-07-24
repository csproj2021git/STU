import axios from 'axios'

const host = "http://localhost:4001/api"

// sets header default token
const setToken = token => {
    if(token){
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else{
        delete axios.defaults.headers.common['Authorization']
    }
}


const call = async (method, path, data) => {
    const response = await axios[method](`${host}/${path}`, data)
    return response.data
}

export default {call, setToken}