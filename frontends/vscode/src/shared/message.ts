import { CoreMessage } from "ai";

export const PORT = 54562;

export const connect = (onMessage: (message: CoreMessage) => void) => new Promise<WebSocket>((resolve, reject) => {
  const url = `ws://localhost:${PORT}`;
  const ws = new WebSocket(url);

  ws.onerror = (error) => {
    reject(error);
  };

  ws.onmessage = (event) => {
    const response = JSON.parse(event.data) as CoreMessage;

    onMessage(response);
  };

  ws.onopen = () => {
    resolve(ws);
  };
});

export const sendMessage = (ws: WebSocket, message: CoreMessage): Promise<void> =>new Promise((resolve, reject) => {
  const data = JSON.stringify(message);

  ws.send(data);
});
