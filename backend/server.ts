import { CoreMessage } from "ai";
import express, { Request, Response } from "express";
import { getAgentResponse } from "./agent";

export const PORT = 54562;

export function startServer() {
  const messages: CoreMessage[] = [];
  const app = express();

  app.use(express.json());

  app.post("/message", async (req: Request, res: Response) => {
    const message: CoreMessage = req.body;

    console.log("Received message from user.");

    messages.push(message);

    const responseMessage = await getAgentResponse(messages);

    console.log("Received response from LLM.");

    messages.push(responseMessage);

    res.json(responseMessage);
  });

  app.listen(PORT, () => {
    console.log(`atyper server running on http://localhost:${PORT}`);
  });
}
