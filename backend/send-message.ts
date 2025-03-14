import WebSocket from "ws";
import { Message } from "./server";
import { CoreMessage } from "ai";

export const sendMessage = (ws: WebSocket, message: Message) => {
  ws.send(JSON.stringify(message));
};

export const sendCoreMessage = (ws: WebSocket, message: CoreMessage) => {
  sendMessage(ws, {
    type: "coreMessage",
    data: message
  });
};
