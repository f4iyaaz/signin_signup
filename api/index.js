const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const userRouter = require('./routes/user.route')
const authRouter = require('./routes/auth.route')
dotenv.config()

app = express()
app.use(express.json())

mongoose.connect(process.env.MONGO)
    .then(() => console.log('Connection successful!'))
    .catch((err) => console.log(err))

app.listen(3000, () => {
    console.log('Server is running at port 3000')
})

app.use('/api/user', userRouter)
app.use('/api/auth', authRouter)

// error handling middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || 'Internal server error'
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
})