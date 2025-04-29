import { CoreMessage } from "ai";
import { WebSocketServer } from "ws";
import {
  handleCoreMessage,
  handleQuestionResponseMessage,
  handleSetCwdMessage,
} from "./message-handlers/handlers";

export const PORT = 54562;

export type MessageType =
  | "coreMessage"
  | "setCwd"
  | "question"
  | "questionResponse";

export interface Message {
  type: MessageType;
  data: any;
}

export type MessageCoreMessage = Message & {
  type: "coreMessage";
  data: CoreMessage;
};

export type MessageSetCwd = Message & {
  type: "setCwd";
  data: {
    cwd: string;
  };
};

export type MessageQuestion = Message & {
  type: "question";
  data: {
    questionId: string;
    question: string;
    fileContents?: string;
  };
};

export type MessageQuestionResponse = Message & {
  type: "questionResponse";
  data: {
    questionId: string;
    answer: boolean;
  };
};

export type Questions = {
  [questionId: string]: (message: MessageQuestionResponse) => void;
};

export function startServer() {
  const wss = new WebSocketServer({ port: PORT });

  wss.on("error", (error) => {
    console.error(error);
  });

  wss.on("connection", (ws) => {
    const messages: CoreMessage[] = [];
    const questions: Questions = {};

    ws.on("error", (error) => {
      console.error(error);
    });

    ws.on("message", async (data) => {
      try {
        const message: Message = JSON.parse(data.toString());

        if (message.type === "coreMessage") {
          await handleCoreMessage(
            ws,
            questions,
            messages,
            message as MessageCoreMessage
          );
        } else if (message.type === "setCwd") {
          await handleSetCwdMessage(message as MessageSetCwd);
        } else if (message.type === "questionResponse") {
          await handleQuestionResponseMessage(
            questions,
            message as MessageQuestionResponse
          );
        } else {
          console.warn("Unknown message type " + message.type);
        }
      } catch (error) {
        console.error(error);
      }
    });
  });

  console.log(`WebSocket server running on ws://localhost:${PORT}`);
}
