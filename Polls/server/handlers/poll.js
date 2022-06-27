const db = require('../models')
const poll = require('../models/poll')

// Show all polls in DB
exports.showPolls = async (req,res,next) => {
    try{
        const polls = await db.Poll.find()
        res.status(200).json(polls)
    }catch(err){
        err.status = 400
        next(err)
    }
}

// Create poll
exports.createPoll = async (req, res, next) => {
    try{
        const {id} = req.decoded
        const user = await db.User.findById(id)
        const {question, options} = req.body
        const poll = await db.Poll.create({
            user,
            question,
            options: options.map(option => ({
                option, votes: 0
            }))
        })
        user.polls.push(poll._id)
        await user.save()
        res.status(201).json({...poll._doc, user: user._id})
    }catch(err){
        err.status = 400
        next(err)
    }
}

// Show all specific users Polls
exports.usersPolls = async (req, res, next) => {
    try{
        const {id} = req.decoded
        const user = await db.User.findById(id).populate('polls')
        res.status(200).json(user.polls)
    }catch(err){
        err.status = 400
        next(err)
    }
}

// Show specific users specific poll
exports.getPoll = async (req,res,next) => {
    try{
        const {id} = req.params
        const poll = await db.Poll.findById(id)
        .populate('user',['username','id'])
        if(!poll){
           throw new Error('No poll found') 
        }
        res.status(200).json(poll)
    }catch(err){
        err.status = 400 
        next(err)
    }
}

// Delete poll
exports.deletePoll = async (req,res,next) => {
    try{
        const {id: pollId} = req.params
        const {id: userId} = req.decoded 
        const poll = await db.Poll.findById(pollId)
        if(!poll){
            throw new Error('No poll found')
        }
        if(poll.user.toString() !== userId){
            throw new Error('Unauthorized access')
        }
        await poll.remove()
        res.status(202).json(poll)
    }catch(err){
        err.status = 400 
        next(err)
    }
}

// Vote poll
exports.vote = async (req, res, next) => {
    const { id: pollId } = req.params
    const { id: userId } = req.decoded
    const { answer } = req.body
    try {
      if (answer) {
        const poll = await db.Poll.findById(pollId)
        if (!poll){
             throw new Error('No poll found')
        }        
        // Add user vote
        const vote = poll.options.map(
          option =>
            option.option === answer // Check if voted answer is curernt ansewr
              ? {
                  option: option.option,
                  _id: option._id,
                  votes: option.votes + 1,
                }
              : option,
        )
        // User hasn't voted before
        if (poll.voted.filter(user => user.toString() === userId).length <= 0) {
          poll.voted.push(userId)
          poll.options = vote
          await poll.save()
  
          return res.status(202).json(poll)
        } else {
          throw new Error('Already voted')
        }
      } else {
        throw new Error('No Answer Provided')
      }
    } catch (err) {
      return next({
        status: 400,
        message: err.message,
      })
    }
  }