import WebSocket from "ws";
import { Message, Questions } from "./server";
import { CoreMessage } from "ai";

export const sendMessage = (ws: WebSocket, message: Message) => {
  ws.send(JSON.stringify(message));
};

export const sendCoreMessage = (ws: WebSocket, message: CoreMessage) => {
  sendMessage(ws, {
    type: "coreMessage",
    data: message,
  });
};

export const askQuestion = (
  questions: Questions,
  ws: WebSocket,
  question: string,
  fileContents?: string
) => {
  return new Promise<boolean>((resolve) => {
    const questionId = String(Math.floor(Math.random() * 10000000000));

    questions[questionId] = (message) => {
      resolve(message.data.answer);
    };

    sendMessage(ws, {
      type: "question",
      data: {
        questionId,
        question,
        fileContents,
      },
    });
  });
};
