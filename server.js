require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const { ExpressPeerServer } = require('peer')
const path = require('path')
const morgan = require("morgan")

const SocketServer = require('./socketServer')


const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use(cors())
app.use(cookieParser())


// Socket
const http = require('http').createServer(app)
const io = require('socket.io')(http, {
    cors: {
        origin: true
    }
})

io.on('connection', socket => {
    SocketServer(socket)
})

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


const URI = process.env.MONGODB_URL
mongoose.connect(URI, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err => {
    if(err) throw err;
    console.log('Connected to mongodb')
})

if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'))
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
    })
}


const port = process.env.PORT || 5000
http.listen(port, () => {
    console.log('Server is running on port', port)
})