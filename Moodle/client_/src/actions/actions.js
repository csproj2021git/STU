import api from "../services/api"

export const getCourses = async () => {
    try{
        const response = await api.call('get','course')
        return response
    }catch (err){
        console.log(err)
    }   
}

export const sign = async ({number}) => {
    console.log(number)
    try{
        const response = await api.call('post','course/user',{number: number})
        return response
    }catch (err){
        console.log(err)
    }
}

export const createCourse = async ({number,name}) => {
    try{
        const response = await api.call('post','course',{number: number, name: name})
        return response
    }catch (err){
        console.log(err)
    }
}

export const getAllCourses = async () => {
    try{
        const response = await api.call('get','course')
        return response
    }catch (err){
        console.log(err)
    }
}

export const createRoom = async ({number,name}) => {
    try{
        const response = await api.call('post','course/room',{number: number, name: name})
        return response
    }catch (err){
        console.log(err)
    }
}

export const getUserCourses = async () => {
    try{
        const response = await api.call('get','course/user')
        return response
    }catch (err){
        console.log(err)
    }
}

export const getCourseRooms = async ({number}) => {
    try{
        const response = await api.call('put','course/room', {number: number})
        return response
    }catch (err){
        console.log(err)
    }
}

export default {getCourses, sign, createCourse, getAllCourses,
     createRoom, getUserCourses, getCourseRooms}
