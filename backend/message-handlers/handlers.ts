import { CoreMessage } from "ai";
import { Message, MessageCoreMessage, MessageQuestionResponse, MessageSetCwd, Questions } from "../server";
import { getAgentResponse } from "../agent";
import type { WebSocket } from "ws";
import { sendCoreMessage } from "../send-message";
import { chdir } from "process";

export const handleCoreMessage = async (ws: WebSocket, questions: Questions, messages: CoreMessage[], message: MessageCoreMessage) => {
  const coreMessage: CoreMessage = message.data;
  console.log("Received message from user: " + JSON.stringify(coreMessage));

  messages.push(coreMessage);

  const { responseMessage, newMessages } = await getAgentResponse(ws, messages, questions);

  console.log("Received response from LLM.");

  messages.push(...newMessages);

  sendCoreMessage(ws, responseMessage);
};

export const handleSetCwdMessage = async (message: MessageSetCwd) => {
  console.log("Setting cwd to " + message.data.cwd);
  chdir(message.data.cwd);
};

export const handleQuestionResponseMessage = async (questions: Questions, message: MessageQuestionResponse) => {
  console.log("Received question response " + message.data.answer);

  const question = questions[message.data.questionId];

  if (question) {
    question(message);

    delete questions[message.data.questionId];
  } else {
    console.warn("Question not found for questionId " + message.data.questionId);
  }
};
