import { CoreMessage } from "ai";

export const PORT = 54562;

export type MessageType = "coreMessage" | "setCwd" | "question" |"questionResponse";

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

export type MessageQuestion = Message & {
  type: "question"
  data: {
    questionId: string;
    question: string;
    fileContents?: string;
  }
};

export type MessageQuestionResponse = Message & {
  type: "questionResponse"
  data: {
    questionId: string;
    answer: boolean;
  }
};

export const connect = (onMessage: (message: Message) => void) => new Promise<WebSocket>((resolve, reject) => {
  const url = `ws://localhost:${PORT}`;
  const ws = new WebSocket(url);

  ws.onerror = (error) => {
    console.error(error);
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
  console.log("ws sendMessage " + data);

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

export const sendQuestionResponseMessage = (ws: WebSocket, questionId: string, answer: boolean) => {
  const message: MessageQuestionResponse = {
    type: "questionResponse",
    data: {
      questionId,
      answer
    }
  };

  sendMessage(ws, message);
};


