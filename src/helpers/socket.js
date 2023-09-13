const socketIo = require("socket.io");

const { logger } = require("./logger");
const socketConfig = require("../configs/socket.config");

const ROOM_NAME_PATTERN = "room::user-";

let socketUsers = [];
let users = [];
let io;

const getIo = () => {
  return io;
};

const getRoomName = (userId) => {
  return `${ROOM_NAME_PATTERN}${userId}`;
};

const removeSocketUser = async ({ socket }) => {
  const beforeFilteredUsers = [...users];
  const rooms = io.sockets.adapter.rooms;
  users = users.filter((user) => {
    const usersInRoom =
      rooms && rooms.get(getRoomName(user.id))
        ? Array.from(rooms.get(getRoomName(user.id)))
        : [];
    return usersInRoom.length > 0;
  });
  if (beforeFilteredUsers.length > users.length) {
    const roomsName = Array.from(rooms.keys());
    const roomsToBroadcast = roomsName.filter((room) =>
      room.startsWith(ROOM_NAME_PATTERN)
    );
    roomsToBroadcast.forEach((room) => {
      socket
        .to(room)
        .emit("user_is_offline", socketUsers[socket.id.toString()]);
    });
  }

  delete socketUsers[socket.id];
  return users;
};

const addSocketUser = async ({ user, socket }) => {
  socketUsers[socket.id.toString()] = user._id;
  const filterUsers = users.filter((socketUser) => socketUser.id != user._id);
  if (filterUsers.length == users.length) {
    users.push({
      id: user._id,
      username: user.username,
      avatar: user.avatar,
      followers: user.followers,
    });
  }
  const roomName = getRoomName(user._id);
  socket.join(roomName);

  logger.info(
    JSON.stringify({
      msg: "User join room",
      userId: user._id,
      socketId: socket.id,
      room: roomName,
    })
  );
  const rooms = io.sockets.adapter.rooms;
  return users;
};

const getSocketUserById = async (id) => {
  return users.filter((user) => user.id === id)[0];
};

const handleSocketEvents = (socket, io) => {
  socket.on("user_joined", async (joinedUser) => {
    await addSocketUser({ user: joinedUser, socket });
    socket.broadcast.emit("user_is_online", joinedUser._id);

    for (const alreadyUser of users) {
      socket
        .to(getRoomName(joinedUser._id))
        .emit("user_is_online", alreadyUser.id);
      socket.emit("user_is_online", alreadyUser.id);
    }
  });

  socket.on("disconnect", async () => {
    await removeSocketUser({ socket });
  });

  // Message
  socket.on("add_message", async (msg) => {
    const user = users.find((user) => user.id === msg.recipient);
    user && socket.to(getRoomName(user.id)).emit("add_message_to_client", msg);
  });

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
};

const reconnectAllUsers = ({ socket }) => {
  socket.emit("user_reconnected");
};

const initSocketIo = (http) => {
  io = socketIo(http, socketConfig);

  io.on("connection", (socket) => {
    reconnectAllUsers({ socket });
    handleSocketEvents(socket);
  });
};

// const editData = (data, id, call) => {
// 	const newData = data.map(item =>
// 		item.id === id ? { ...item, call } : item
// 	)
// 	return newData
// }

module.exports = {
  getIo,
  initSocketIo,
  getSocketUserById,
  getRoomName,
};
