import { CoreMessage } from "ai";
import { Message, MessageCoreMessage, MessageSetCwd } from "../server";
import { getAgentResponse } from "../agent";
import type { WebSocket } from "ws";
import { sendCoreMessage } from "../send-message";
import { chdir } from "process";

export const handleCoreMessage = async (ws: WebSocket, messages: CoreMessage[], message: MessageCoreMessage) => {
  const coreMessage: CoreMessage = message.data;
  console.log("Received message from user.");

  messages.push(coreMessage);

  const { responseMessage, newMessages } = await getAgentResponse(messages);

  console.log("Received response from LLM.");

  messages.push(...newMessages);

  sendCoreMessage(ws, responseMessage);
};

export const handleSetCwdMessage = async (ws: WebSocket, message: MessageSetCwd) => {
  console.log("Setting cwd to " + message.data.cwd);
  chdir(message.data.cwd);
};
