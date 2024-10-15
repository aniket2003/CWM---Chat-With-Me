const Conversations = require("../models/Conversations");
const Messages = require("../models/Messages");

const sendMessage = async(io, userSocketMap, data)=>{
    const from = data.from;
    const to = data.to;
    console.log(from, " ", data.to);
    const fromSocketId = userSocketMap.get(from);
    const toSocketId = userSocketMap.get(to);
    // console.log(fromSocketId, " ", toSocketId);
    let conversation = await Conversations.findOne({
        participants: {$all : [from , to]},
    });

    if(!conversation){
        conversation = await Conversations.create({
            participants : [from, to],
        })
    }
    
    const Message = await Messages.create({
        from : from,
        to : to,
        messageType : data.messageType,
        content: data.message
    });

    if(Message){
      conversation.messages.push(Message._id);
      await conversation.save();
    }

    const dataemit = {
        from : from,
        to : to,
        content: data.message,
        timestamp: Message.timestamp,
    }

    // console.log(toSocketId, "   ",fromSocketId, " ", dataemit);

    if(toSocketId){
        io.to(toSocketId).emit("receiveMessage", dataemit);
    }
    if(fromSocketId){
        io.to(fromSocketId).emit("receiveMessage", dataemit);
    }
  };


  const getMessages = async(req,res)=>{

    try{
        const {from , to} = req.body;
        const conversations = await Conversations.findOne({
            participants:{$all : [from, to]}
        }).populate("messages");
        console.log(conversations);
        res.send({"conversations" : conversations});
    }catch(err){
        console.error("Error: ", err);
    }

  }



  const SocketAddFriend = async(io, userSocketMap, data)=>{
    try{

        const {from, to} = data;
        const toSocketId = userSocketMap.get(to);
        const fromSocketId = userSocketMap.get(from);
        console.log(toSocketId);
        const newData = {
            _id: data.from,
            username: data.fromusername,
            email: data.fromemail,
            ProfilePic: data.fromProfilePic,
            bio: data.frombio,
            append: false,
        }
        if(toSocketId){
            io.to(toSocketId).emit("AddFriend", newData);
        }

        const newData2 = {
            _id: data.to,
            username: data.tousername,
            email: data.toemail,
            ProfilePic: data.toProfilePic,
            bio: data.tobio,
            append: true,
        }

        if(fromSocketId){
            io.to(fromSocketId).emit("AddFriend", newData2);
        }



    }catch(err){
        console.log(err);
    }
  }


  const SocketDeleteFriend = async(io, userSocketMap, data)=>{
    try{

        const {username,userid, friendid} = data;
        const fromSocketId = userSocketMap.get(userid)
        const toSocketId = userSocketMap.get(friendid);


        const Data1 = {
            friend: false,
            userid: userid,
            friendid: friendid,
        }

        const Data2 = {
            friend: true,
            username: username,
            userid: userid,
            friendid: friendid,
        }
        if(toSocketId){
            io.to(toSocketId).emit("DeleteFriend", Data2);
        }

        if(fromSocketId){
            io.to(fromSocketId).emit("DeleteFriend", Data1);
        }



    }catch(err){
        console.log(err);
    }
  }

  module.exports = { sendMessage, getMessages, SocketAddFriend, SocketDeleteFriend };