const socketIo = require('socket.io')

const { logger } = require('./logger')
const { redis } = require('./redis')

let io

const SOCKET_USERS = 'socketUsers'

const getIo = function() {
    return io
}

const getSocketUsers = async () => {
    const users = await redis.get(SOCKET_USERS)
    return users ? JSON.parse(users) : []
}

const removeSocketUser = async ({ socket }) => {
    let users = await getSocketUsers()
    users = users.filter(user => user.socketId !== socket.id)
    await redis.set(SOCKET_USERS, JSON.stringify(users))
    return users
}

const addSocketUser = async ({ user, socket }) => {
    let users = await getSocketUsers()
    users = users.filter(socketUser => socketUser.id != user._id)
    await redis.set(SOCKET_USERS, JSON.stringify(users))

    users.push({
        id: user._id,
        socketId: socket.id,
        username: user.username,
        avatar: user.avatar,
        followers: user.followers
    })
    await redis.set(SOCKET_USERS, JSON.stringify(users))
    return users
}

const getSocketUserById = async (id) => {
    const users = await getSocketUsers()
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
    })
}

const connectSocket = (socket) => {
    // Connect - Disconnect
    socket.on('userJoined', async (user) => {
        await addSocketUser({ user, socket })
        logger.info(`User ${user._id} with socket_id ${socket.id} joined`)
    })

    socket.on('disconnect', async () => {
        let users = await getSocketUsers()
        
        const foundUser = await users.find(user => user.socketId === socket.id)
        if(foundUser) {
            const clients = users.filter(user => 
                foundUser.followers.find(item => item._id === user.id)
            )

            if(clients.length > 0) {
                clients.forEach(client => {
                    socket.to(`${client.socketId}`).emit('checkUserOffline', foundUser.id)
                })
            }

            if(foundUser.call) {
                const callUser = users.find(user => user.id === foundUser.call)
                if(callUser) {
                    users = editData(users, callUser.id, null)
                    socket.to(`${callUser.socketId}`).emit('callerDisconnect')
                }
            }
            logger.info(`User ${foundUser.id} with socket_id ${socket.id} left`)
            await removeSocketUser({ socket })
        }
    })

    // Likes
    socket.on('likePost', async (newPost) => {
        let users = await getSocketUsers()
        const ids = [ ...newPost.user.followers, newPost.user._id ]
        const clients = users.filter(user => ids.includes(user.id))
        
        if(clients.length > 0) {
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('likeToClient', newPost)
            })
        }
    })

    socket.on('unLikePost', async (newPost) => {
        let users = await getSocketUsers()
        const ids = [ ...newPost.user.followers, newPost.user._id ]
        const clients = users.filter(user => ids.includes(user.id))

        if(clients.length > 0) {
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('unLikeToClient', newPost)
            })
        }
    })

    // Comments
    socket.on('createComment', async (newPost) => {
        let users = await getSocketUsers()
        const ids = [ ...newPost.user.followers, newPost.user._id ]
        const clients = users.filter(user => ids.includes(user.id))
        
        if(clients.length > 0) {
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('createCommentToClient', newPost)
            })
        }
    })

    socket.on('deleteComment', async (newPost) => {
        let users = await getSocketUsers()
        const ids = [ ...newPost.user.followers, newPost.user._id ]
        const clients = users.filter(user => ids.includes(user.id))

        if(clients.length > 0) {
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('deleteCommentToClient', newPost)
            })
        }
    })

    // Follow
    socket.on('follow', async (newUser) => {
        let users = await getSocketUsers()
        const user = users.find(user => user.id === newUser._id)
        user && socket.to(`${user.socketId}`).emit('followToClient', newUser)
    })

    socket.on('unFollow', async (newUser) => {
        let users = await getSocketUsers()
        const user = users.find(user => user.id === newUser._id)
        user && socket.to(`${user.socketId}`).emit('unFollowToClient', newUser)
    })
    
    socket.on('removeNotify', async (msg) => {
        let users = await getSocketUsers()
        const client = users.find(user => msg.recipients.includes(user.id))
        client && socket.to(`${client.socketId}`).emit('removeNotifyToClient', msg)

    })

    // Message
    socket.on('addMessage', async (msg) => {
        let users = await getSocketUsers()
        const user = users.find(user => user.id === msg.recipient)
        user && socket.to(`${user.socketId}`).emit('addMessageToClient', msg)
    })

    // Check User Online / Offline
    socket.on('checkUserOnline', async (data) => {
        let users = await getSocketUsers()
        const following = users.filter(user => 
            data.following.find(item => item._id === user.id)
        )
        socket.emit('checkUserOnlineToMe', following)

        const clients = users.filter(user => 
            data.followers.find(item => item._id === user.id)
        )
        if(clients.length > 0) {
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('checkUserOnlineToClient', data._id)
            })
        }
        
    })

    // // Call User
    // socket.on('callUser', data => {
    //     users = editData(users, data.sender, data.recipient)
        
    //     const client = users.find(user => user.id === data.recipient)
    //     if(client) {
    //         if(client.call) {
    //             socket.emit('userBusy', data)
    //             users = editData(users, data.sender, null)
    //         } else {
    //             users = editData(users, data.recipient, data.sender)
    //             socket.to(`${client.socketId}`).emit('callUserToClient', data)
    //         }
    //     }
    // })

    // socket.on('endCall', data => {
    //     const client = users.find(user => user.id === data.sender)
    //     if(client) {
    //         socket.to(`${client.socketId}`).emit('endCallToClient', data)
    //         users = editData(users, client.id, null)

    //         if(client.call) {
    //             const clientCall = users.find(user => user.id === client.call)
    //             clientCall && socket.to(`${clientCall.socketId}`).emit('endCallToClient', data)

    //             users = editData(users, client.call, null)
    //         }
    //     }
    // })
}


const editData = (data, id, call) => {
    const newData = data.map(item => 
        item.id === id ? { ...item, call } : item
    )
    return newData
}

module.exports = {
    getIo,
    initSocketIo,
    getSocketUserById
}