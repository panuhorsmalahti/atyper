import { CoreMessage } from "ai";

export const PORT = 54562;

export type MessageType = "coreMessage";

export interface Message {
  type: MessageType;
  data: any;
}

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

export const sendCoreMessage = (ws: WebSocket, coreMessage: CoreMessage): Promise<void> =>new Promise((resolve, reject) => {
  const message: Message = {
    type: "coreMessage",
    data: coreMessage
  };
  const data = JSON.stringify(message);

  ws.send(data);
});
