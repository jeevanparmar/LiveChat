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
    origin: process.env.HOST,  
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
        origin: process.env.HOST, 
        credentials: true,
    },
});

global.onlineUsers = new Map();  

io.on("connection", (socket) => {

    // Add user to the onlineUsers map
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);  
    });

    // Handle message sending
    socket.on("send-msg", (data) => {
        
        const sendUserSocket = onlineUsers.get(data.to);  
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-recieve", data);  
            socket.emit("msg-sent", { status: "delivered", msg: data.msg });  
        }
    });
 

    // Handle user disconnection
    socket.on("disconnect", () => {
        onlineUsers.forEach((socketId, userId) => {
            if (socketId === socket.id) {
                onlineUsers.delete(userId);
            }
        });
    });
});

