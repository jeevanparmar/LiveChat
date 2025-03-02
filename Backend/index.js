const express = require('express');
var cors = require('cors');
const dbconnect = require("./config/database");
const socket = require("socket.io");

const app = express();

const Route = require("./routes/Router");

require("dotenv").config();
const Port = process.env.PORT || 3000

app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000",  
    methods: "GET,POST,PUT,DELETE",
    credentials: true
}));

app.use("/api/auth", Route);


app.get('/', (req, res) => {
    res.send('Hello World');
});

dbconnect.dbConnect();
const server = app.listen(Port, () => {
    console.log(`Server is running on port: ${Port}`);
});

const io = socket(server, {
    cors: {
        origin: "http://localhost:3000", 
        credentials: true,
    },
});

global.onlineUsers = new Map();  

io.on("connection", (socket) => {
    console.log("A new user connected");

    // Add user to the onlineUsers map
    socket.on("add-user", (userId) => {
        console.log(`User ${userId} added`);
        onlineUsers.set(userId, socket.id);  
    });

    // Handle message sending
    socket.on("send-msg", (data) => {
        console.log("Message data received: ", data);
        
        const sendUserSocket = onlineUsers.get(data.to);  
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-recieve", data.msg);  
            socket.emit("msg-sent", { status: "delivered", msg: data.msg });  
        }
    });
 

    // Handle user disconnection
    socket.on("disconnect", () => {
        onlineUsers.forEach((socketId, userId) => {
            if (socketId === socket.id) {
                onlineUsers.delete(userId);
                console.log(`User ${userId} disconnected`);
            }
        });
    });
});

