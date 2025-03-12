import { openai } from "@ai-sdk/openai";
import { CoreMessage, generateText } from "ai";
import { tools } from "./tools/tools";

export async function getAgentResponse(messages: CoreMessage[]) {
  const result = await generateText({
    model: openai("gpt-4o"),
    messages,
    tools
  });

  const responseMessage: CoreMessage = {
    role: "assistant",
    content: result.text,
  };
  const newMessages = result.response.messages;

  console.log(JSON.stringify({ responseMessage, newMessages }));

  return { responseMessage, newMessages };
}
