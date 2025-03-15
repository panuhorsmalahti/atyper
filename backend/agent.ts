import { openai } from "@ai-sdk/openai";
import { CoreMessage, generateText } from "ai";
import { tools } from "./tools/tools";

const systemPrompt = `
You're an expert AI programmer.
Complete any request from the user by utilizing the provided tools for reading the current repository and adding new files.
`;

export async function getAgentResponse(messages: CoreMessage[]) {
  const result = await generateText({
    model: openai("gpt-4o"),
    messages,
    tools,
    system: systemPrompt
  });

  const responseMessage: CoreMessage = {
    role: "assistant",
    content: result.text,
  };
  const newMessages = result.response.messages;

  return { responseMessage, newMessages };
}
