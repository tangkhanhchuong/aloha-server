const socketIo = require('socket.io')

const logger = require('./logger')

let users = []
let io;

const getIo = function() {
    return io
}

const getUserById = function (id) {
    return users.filter(user => user.id === id)[0]
}

const initSocketIo = (http) => {
    io = socketIo(http, {
        cors: {
            origin: true
        }
    })
    
    io.on('connection', socket => {
        connectSocket(socket)
        logger.info('Socket server connected !')
    })
}

const connectSocket = (socket) => {
    // Connect - Disconnect
    socket.on('joinUser', async (user) => {
        users.push({
            id: user._id,
            socketId: socket.id,
            username: user.username,
            avatar: user.avatar,
            followers: user.followers
        })
        logger.info(`User joined ${user._id}`)
    })

    socket.on('disconnect', () => {
        const foundUser = users.find(user => user.socketId === socket.id)
        if(foundUser){
            const clients = users.filter(user => 
                foundUser.followers.find(item => item._id === user.id)
            )

            if(clients.length > 0){
                clients.forEach(client => {
                    socket.to(`${client.socketId}`).emit('CheckUserOffline', foundUser.id)
                })
            }

            if(foundUser.call){
                const callUser = users.find(user => user.id === foundUser.call)
                if(callUser){
                    users = editData(users, callUser.id, null)
                    socket.to(`${callUser.socketId}`).emit('callerDisconnect')
                }
            }
            logger.info(`User left ${foundUser.id}`)
        }
        users = users.filter(user => user.socketId !== socket.id)
    })

    // Likes
    socket.on('likePost', newPost => {
        const ids = [ ...newPost.user.followers, newPost.user._id ]
        const clients = users.filter(user => ids.includes(user.id))

        if(clients.length > 0){
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('likeToClient', newPost)
            })
        }
    })

    socket.on('unLikePost', newPost => {
        const ids = [...newPost.user.followers, newPost.user._id]
        const clients = users.filter(user => ids.includes(user.id))

        if(clients.length > 0){
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('unLikeToClient', newPost)
            })
        }
    })


    // Comments
    socket.on('createComment', newPost => {
        const ids = [...newPost.user.followers, newPost.user._id]
        const clients = users.filter(user => ids.includes(user.id))

        if(clients.length > 0){
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('createCommentToClient', newPost)
            })
        }
    })

    socket.on('deleteComment', newPost => {
        const ids = [...newPost.user.followers, newPost.user._id]
        const clients = users.filter(user => ids.includes(user.id))

        if(clients.length > 0){
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('deleteCommentToClient', newPost)
            })
        }
    })

    // Follow
    socket.on('follow', newUser => {
        const user = users.find(user => user.id === newUser._id)
        user && socket.to(`${user.socketId}`).emit('followToClient', newUser)
    })

    socket.on('unFollow', newUser => {
        const user = users.find(user => user.id === newUser._id)
        user && socket.to(`${user.socketId}`).emit('unFollowToClient', newUser)
    })
    
    socket.on('removeNotify', msg => {
        const client = users.find(user => msg.recipients.includes(user.id))
        client && socket.to(`${client.socketId}`).emit('removeNotifyToClient', msg)

    })

    // Message
    socket.on('addMessage', msg => {
        const user = users.find(user => user.id === msg.recipient)
        user && socket.to(`${user.socketId}`).emit('addMessageToClient', msg)
    })

    // Check User Online / Offline
    socket.on('checkUserOnline', data => {
        const following = users.filter(user => 
            data.following.find(item => item._id === user.id)
        )
        socket.emit('checkUserOnlineToMe', following)

        const clients = users.filter(user => 
            data.followers.find(item => item._id === user.id)
        )

        if(clients.length > 0){
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('checkUserOnlineToClient', data._id)
            })
        }
        
    })

    // Call User
    socket.on('callUser', data => {
        users = editData(users, data.sender, data.recipient)
        
        const client = users.find(user => user.id === data.recipient)

        if(client){
            if(client.call){
                socket.emit('userBusy', data)
                users = editData(users, data.sender, null)
            }else{
                users = editData(users, data.recipient, data.sender)
                socket.to(`${client.socketId}`).emit('callUserToClient', data)
            }
        }
    })

    socket.on('endCall', data => {
        const client = users.find(user => user.id === data.sender)

        if(client){
            socket.to(`${client.socketId}`).emit('endCallToClient', data)
            users = editData(users, client.id, null)

            if(client.call){
                const clientCall = users.find(user => user.id === client.call)
                clientCall && socket.to(`${clientCall.socketId}`).emit('endCallToClient', data)

                users = editData(users, client.call, null)
            }
        }
    })
}


const editData = (data, id, call) => {
    const newData = data.map(item => 
        item.id === id ? {...item, call} : item
    )
    return newData;
}

module.exports = {
    getIo,
    initSocketIo,
    getUserById
}