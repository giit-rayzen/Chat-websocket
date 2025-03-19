"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 7800 });
let allSockets = [];
wss.on("connection", (socket) => {
    socket.on("message", (message) => {
        //@ts-ignore
        const parsedMessage = JSON.parse(message);
        if (parsedMessage.type == "join") {
            console.log("user join room" + parsedMessage.payload.roomId);
            allSockets.push({
                socket,
                roomId: parsedMessage.payload.roomId
            });
        }
        if (parsedMessage.type == "chat") {
            //const curUserRomm=allSockets.find((x)=>x.socket==socket).roomId
            let curUserRoom = null;
            for (let i = 0; i < allSockets.length; i++) {
                if (allSockets[i].socket == socket) {
                    curUserRoom = allSockets[i].roomId;
                }
            }
            //now send msg to all users which are part of same room
            for (let i = 0; i < allSockets.length; i++) {
                if (allSockets[i].roomId == curUserRoom) {
                    allSockets[i].socket.send(parsedMessage.payload.message);
                }
            }
        }
    });
});
