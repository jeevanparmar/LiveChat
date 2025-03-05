const express = require("express");
const routes = express.Router();

const { signup, login, getAlluser } = require("../Controller/Auth");
const { getMessages, addMessage,deleteMsg } = require("../Controller/msg");

routes.post("/signup", signup);
routes.post("/login", login);
routes.post("/getAlluser", getAlluser);

routes.post("/addMessage" ,addMessage);
routes.post("/getMessages", getMessages);
routes.post("/deleteMsg",deleteMsg);



module.exports = routes;
