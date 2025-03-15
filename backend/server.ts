import { CoreMessage } from "ai";
import { WebSocketServer } from "ws";
import { handleCoreMessage, handleSetCwdMessage } from "./message-handlers/handlers";

export const PORT = 54562;

export type MessageType = "coreMessage" | "setCwd";

export interface Message {
  type: MessageType;
  data: any;
}

export type MessageCoreMessage = Message & {
  type: "coreMessage",
  data: CoreMessage;
};

export type MessageSetCwd = Message & {
  type: "setCwd"
  data: {
    cwd: string;
  }
};

export function startServer() {
  const wss = new WebSocketServer({ port: PORT });

  wss.on("connection", (ws) => {
    const messages: CoreMessage[] = [];

    ws.on("message", async (data) => {
      const message: Message = JSON.parse(data.toString());

      if (message.type === "coreMessage") {
        handleCoreMessage(ws, messages, message as MessageCoreMessage);
      } else if (message.type === "setCwd") {
        handleSetCwdMessage(message as MessageSetCwd)
      } else {
        console.warn("Unknown message type " + message.type);
      }
    });
  });

  console.log(`WebSocket server running on ws://localhost:${PORT}`);
}
