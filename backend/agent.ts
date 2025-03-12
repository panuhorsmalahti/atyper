import { openai } from "@ai-sdk/openai";
import { CoreMessage, streamText } from "ai";

export async function getAgentResponse(messages: CoreMessage[]) {
  const result = streamText({
    model: openai("gpt-4o"),
    messages,
  });

  let fullResponse = "";

  for await (const delta of result.textStream) {
    fullResponse += delta;
  }

  const responseMessage: CoreMessage = {
    role: "assistant",
    content: fullResponse,
  };

  return responseMessage;
}
