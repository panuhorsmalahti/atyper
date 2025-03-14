import { CoreMessage } from "ai";
import { WebSocketServer } from "ws";
import { handleCoreMessage } from "./message-handlers/handlers";

export const PORT = 54562;

export type MessageType = "coreMessage";

export interface Message {
  type: MessageType;
  data: any;
}

export function startServer() {
  const wss = new WebSocketServer({ port: PORT });

  wss.on("connection", (ws) => {
    const messages: CoreMessage[] = [];

    ws.on("message", async (data) => {
      const message: Message = JSON.parse(data.toString());

      if (message.type === "coreMessage") {
        handleCoreMessage(ws, messages, message);
      } else {
        console.warn("Unknown message type " + message.type);
      }
    });
  });

  console.log(`WebSocket server running on ws://localhost:${PORT}`);
}
