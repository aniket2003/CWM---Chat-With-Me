const { sendMessage, SocketAddFriend, SocketDeleteFriend, SendFile } = require("./controllers/messagecontroller");
const { Server: SocketIoServer } = require("socket.io");

const setSocket = (server) => {
  const io = new SocketIoServer(server, {
    cors: {
      origin: process.env.ORIGIN,
      credentials: true,
      methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
      preflightContinue: false,
      optionsSuccessStatus: 204,
    },
  });

  const userSocketMap = new Map();

  const disconnect = (socket) => {
    console.log(`User Disconnected: ${socket.id}`);
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
  };



  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`User Connected: ${userId} with socket ID: ${socket.id}`);
    } else {
      console.log("User ID not provided during connection.");
    }
    socket.on("send-message", (data)=> sendMessage(io, userSocketMap, data))
    socket.on("send-file", (data)=> SendFile(io, userSocketMap, data));
    socket.on("AddFriend", (data)=>SocketAddFriend(io, userSocketMap, data));
    socket.on("DeleteFriend", (data)=>SocketDeleteFriend(io, userSocketMap, data));
    socket.on("disconnect", () => disconnect(socket));
  });
};

module.exports = setSocket;
