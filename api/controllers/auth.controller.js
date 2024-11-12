const bcryptjs = require('bcryptjs')
const User = require('../models/user.model')
const errorHandler = require('../utils/error')
const jwt = require('jsonwebtoken')

const signup = async (req, res, next) => {
    const { username, email, password } = req.body
    try {
        const hashedPassword = bcryptjs.hashSync(password, 10)
        const newUser = new User({username, email, password: hashedPassword})
        await newUser.save()
        res.status(201).json('User created successfully')
    }
    catch(err) {
        next(err)
    }
}
// g
const signin = async (req, res, next) => {
    const {email, password} = req.body
    try{
        const validUser = await User.findOne({email: email})
        if(!validUser) {
            return next(errorHandler(404, 'User not found!'))
        }
        else{
            const validPassword = await bcryptjs.compareSync(password, validUser.password)
            if(!validPassword) {
                return next(errorHandler(401, 'Invalid password!'))
            }
            else {
                const token = await jwt.sign({id: validUser._id}, process.env.JWT_SECRET)
                const {password: pass, ...rest} = validUser._doc
                res.cookie('access_token', token, {httpOnly: true}).status(200).json({rest})
            }
        }
    }
    catch(error) {
        next(error)
    }
}

module.exports = {signup, signin}