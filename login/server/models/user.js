const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

//Exported - user schema
const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    created: {
        type: Date,
        default: Date.now,
    },
    polls:[{
        type: mongoose.Schema.Types.ObjectId, 
        ref:"Poll",
    }],
	course:[{
        type: mongoose.Schema.Types.ObjectId, 
        ref:"Course",
    }],
})

// Before saving to DB - hash the password
userSchema.pre('save', async function (next) {
    try{
        if(!this.isModified('password')){
            return next()
        }
        const hashed = await bcrypt.hash(this.password, 10)
        this.password = hashed
        return next()
    } catch(err){
        return next(err)
    }
})

//When logging in - compare the password to the 
userSchema.methods.comparePassword = async function(attempt, next){
    try{
        return await bcrypt.compare(attempt, this.password)
    }catch(err){
        next(err)
    }
}

module.exports = mongoose.model('User', userSchema)