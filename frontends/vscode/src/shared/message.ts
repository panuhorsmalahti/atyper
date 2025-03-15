import { CoreMessage } from "ai";

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

export const connect = (onMessage: (message: Message) => void) => new Promise<WebSocket>((resolve, reject) => {
  const url = `ws://localhost:${PORT}`;
  const ws = new WebSocket(url);

  ws.onerror = (error) => {
    reject(error);
  };

  ws.onmessage = (event) => {
    const response = JSON.parse(event.data) as Message;

    onMessage(response);
  };

  ws.onopen = () => {
    resolve(ws);
  };
});

const sendMessage = (ws: WebSocket, message: Message) => {
  const data = JSON.stringify(message);

  ws.send(data);
};

export const sendCoreMessage = (ws: WebSocket, coreMessage: CoreMessage) => {
  const message: MessageCoreMessage = {
    type: "coreMessage",
    data: coreMessage
  };

  sendMessage(ws, message);
};

export const sendSetCwdMessage = (ws: WebSocket, cwd: string) => {
  const message: MessageSetCwd = {
    type: "setCwd",
    data: {
      cwd
    }
  };

  sendMessage(ws, message);
};




