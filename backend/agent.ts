import { openai } from "@ai-sdk/openai";
import { CoreMessage, generateText } from "ai";
import { getTools } from "./tools/tools";
import WebSocket from "ws";
import { Questions } from "./server";

const systemPrompt = `
You're an expert AI programmer.
Complete any request from the user by utilizing the provided tools for reading the current repository and adding new files.
`;

export async function getAgentResponse(ws: WebSocket, messages: CoreMessage[], questions: Questions) {
  console.log("getAgentResponse started");
  const result = await generateText({
    model: openai("gpt-4o"),
    messages,
    tools: getTools(ws, questions),
    system: systemPrompt
  });
  console.log("getAgentResponse received");

  const responseMessage: CoreMessage = {
    role: "assistant",
    content: result.text,
  };
  const newMessages = result.response.messages;

  return { responseMessage, newMessages };
}
