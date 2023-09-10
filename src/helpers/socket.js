const socketIo = require('socket.io')

const { logger } = require('./logger')
const { redis } = require('./redis')

const SOCKET_USERS = 'socketUsers'
const ROOM_NAME_PATTERN = 'room::user-'

let users = []
let io

const getIo = function () {
	return io
}

const getRoomName = (userId) => {
	return `${ROOM_NAME_PATTERN}${userId}`
}

const getSocketUsers = async () => {
	const users = await redis.get(SOCKET_USERS)
	return users ? JSON.parse(users) : []
}

const removeSocketUser = async ({ socket }) => {
	let users = await getSocketUsers()
	users = users.filter(user => {
		const room = io.sockets.adapter.rooms[getRoomName(user.id)]
		const usersInRoom = room ? Object.keys(room.sockets) : []
		return usersInRoom.length > 0
	})

	await redis.set(SOCKET_USERS, JSON.stringify(users))
	return users
}

const addSocketUser = async ({ user, socket }) => {
	let users = await getSocketUsers()
	const filterUsers = users.filter(socketUser => socketUser.id != user._id)
	if (filterUsers.length < users.length) {
		users.push({
			id: user._id,
			username: user.username,
			avatar: user.avatar,
			followers: user.followers
		})
		await redis.set(SOCKET_USERS, JSON.stringify(users))

		const roomName = getRoomName(user._id)
		socket.join(roomName)
		logger.info(JSON.stringify({
			msg: 'User join room',
			userId: user._id,
			socketId: socket.id
		}))
	}

	return users
}

const getSocketUserById = async (id) => {
	const users = await getSocketUsers()
	return users.filter(user => user.id === id)[0]
}

const initSocketIo = (http) => {
	io = socketIo(http,)

	io.on('connection', socket => {
		connectSocket(socket)
	})
}

const connectSocket = (socket) => {
	// Connect - Disconnect
	socket.on('userJoined', async (user) => {
		await addSocketUser({ user, socket })
	})

	socket.on('userLeft', async (user) => {
		console.log('user left')
	})

	socket.on('disconnect', async () => {
		// let users = await getSocketUsers()
		// const foundUser = await users.find(user => user.socketId === socket.id)
		// if(foundUser) {
		//     const clients = users.filter(user => 
		//         foundUser.followers.find(item => item._id === user.id)
		//     )

		//     if(clients.length > 0) {
		//         clients.forEach(client => {
		//             socket.to(getRoomName(client.id)).emit('checkUserOffline', foundUser.id)
		//         })
		//     }

		//     if(foundUser.call) {
		//         const callUser = users.find(user => user.id === foundUser.call)
		//         if(callUser) {
		//             users = editData(users, callUser.id, null)
		//             socket.to(getRoomName(callUser.id)).emit('callerDisconnect')
		//         }
		//     }
		// }
		const allRooms = Object.keys(socket.adapter.rooms)
		const roomsToBroadcast = allRooms.filter((room) => {
			return room !== userRoom && room.startsWith(ROOM_NAME_PATTERN)
		})
		roomsToBroadcast.forEach((room) => {
			socket.to(room).emit('checkUserOffline', foundUser.id)
		})

		// logger.info(`User ${foundUser.id} with socket_id ${socket.id} left`)
		await removeSocketUser({ socket })
	})

	socket.on('removeNotify', async (msg) => {
		let users = await getSocketUsers()
		const client = users.find(user => msg.recipients.includes(user.id))
		client && socket.to(getRoomName(client.id)).emit('removeNotifyToClient', msg)

	})

	// Message
	socket.on('addMessage', async (msg) => {
		let users = await getSocketUsers()
		const user = users.find(user => user.id === msg.recipient)
		user && socket.to(getRoomName(user.id)).emit('addMessageToClient', msg)
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
		if (clients.length > 0) {
			clients.forEach(client => {
				socket.to(getRoomName(client.id)).emit('checkUserOnlineToClient', data._id)
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
	getSocketUserById,
	getRoomName
}