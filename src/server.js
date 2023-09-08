require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const { ExpressPeerServer } = require('peer')
const path = require('path')
const morgan = require("morgan")

const errorHandler = require('./middleware/error.handler')
const { initSocketIo } = require('./helpers/socket')
const logger = require('./helpers/logger')

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use(cors())
app.use(cookieParser())

// Socket
const http = require('http').createServer(app)

initSocketIo(http)

// Create peer server
ExpressPeerServer(http, { path: '/' })


// Routes
app.use('/api/v1/auth', require('./routes/auth.router'))
app.use('/api/v1/users', require('./routes/user.router'))
app.use('/api/v1/posts', require('./routes/post.router'))
app.use('/api/v1/conversations', require('./routes/conversation.router'))
app.use('/api/v1/comments', require('./routes/comment.router'))
app.use('/api/v1/notifies', require('./routes/notify.router'))
app.use('/api/v1/messages', require('./routes/message.router'))
app.use('/api/v1/files', require('./routes/file.router'))
app.use(errorHandler)


const URI = process.env.MONGODB_URL
mongoose.connect(URI, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err => {
    if(err) {
        logger.error(err.message)
        throw err;
    }
    logger.info(`Server is running on port ${port}`)
})

if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'))
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
    })
}


const port = process.env.PORT || 5000
http.listen(port, () => {
    logger.info(`Server is running on port ${port}`)
})