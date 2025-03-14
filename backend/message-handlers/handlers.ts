import { CoreMessage } from "ai";
import { Message } from "../server";
import { getAgentResponse } from "../agent";
import type { WebSocket } from "ws";
import { sendCoreMessage } from "../send-message";

export const handleCoreMessage = async (ws: WebSocket, messages: CoreMessage[], message: Message) => {
  const coreMessage: CoreMessage = message.data;
  console.log("Received message from user.");

  messages.push(coreMessage);

  const { responseMessage, newMessages } = await getAgentResponse(messages);

  console.log("Received response from LLM.");

  messages.push(...newMessages);

  sendCoreMessage(ws, responseMessage);
};
