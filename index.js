const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001","https://cbfe-41-139-202-31.ngrok-free.app"], // Add multiple origins here
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`user ${socket.id} connected`);

  // join a room
  // socket.on("join_room",(data)=>{
  //     socket.join(data.room)
  //     console.log(`user ${socket.id} joined room ${data.room}`)

  // })

  // send message
  socket.on("send_message", (data) => {
    // console.log("roomdata",data.room)
    console.log("message", data);
    socket.broadcast.emit("receive_message", data);
    // socket.to(data.room).emit("receive_message",data)
  });

  socket.on("requestRide", async (data) => {
    console.log("Requesting ride from:", data);
    // const { userId, startLocation, endLocation } = data;
    socket.broadcast.emit("receive_message", data);
  });

  // Driver accepts or rejects the ride
  socket.on("rideResponse", async (data) => {
    // const { driverId, userId, accepted } = data;
    console.log("ride state",data)
    console.log("acceptstate",data)
    // const userSocket = getUserSocket(userId);
    const ridestatus = data.accepted;
    console.log("status", ridestatus)
    if(ridestatus){
        socket.broadcast.emit("driverFound", data);
    }
    

    // if (accepted) {
    //   userSocket.emit("rideAccepted", { driverId });
    // } else {
    //   userSocket.emit("rideRejected");
    // }
  });
});

server.listen(5000, () => {
  console.log("Server is running on port 5000");
});

app.get('/',(req,res)=>{
  res.send('Welcome to the Rider App Server')
})
