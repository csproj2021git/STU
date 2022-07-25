import api from "../services/api"

export const getCourses = async () => {
    try{
        const courses = await api.call('get','course')
        return courses
    }catch (err){
        console.log(err)
    }
}

export default {getCourses}
