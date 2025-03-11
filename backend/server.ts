import { openai } from "@ai-sdk/openai";
import { CoreMessage, streamText } from "ai";
import express, { Request, Response } from "express";

export const PORT = 54562;

export function startServer() {
  const messages: CoreMessage[] = [];
  const app = express();

  app.use(express.json());

  app.post("/message", async (req: Request, res: Response) => {
    const message: CoreMessage = req.body;

    console.log("Received message from user.");

    messages.push(message);

    const result = streamText({
      model: openai("gpt-4o"),
      messages,
    });

    let fullResponse = "";

    for await (const delta of result.textStream) {
      fullResponse += delta;
    }

    console.log("Received response from LLM.");

    const responseMessage: CoreMessage = {
      role: "assistant",
      content: fullResponse,
    };
    messages.push(responseMessage);

    res.json(responseMessage);
  });

  app.listen(PORT, () => {
    console.log(`atyper server running on http://localhost:${PORT}`);
  });
}
