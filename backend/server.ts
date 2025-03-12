import { CoreMessage } from "ai";
import express, { Request, Response } from "express";
import { getAgentResponse } from "./agent";
import { WebSocketServer } from "ws";

export const PORT = 54562;

export function startServer() {
  const wss = new WebSocketServer({ port: PORT });

  wss.on("connection", (ws) => {
    const messages: CoreMessage[] = [];

    ws.on("message", async (data) => {
      const message: CoreMessage = JSON.parse(data.toString());

      console.log("Received message from user.");

      messages.push(message);

      const { responseMessage, newMessages } = await getAgentResponse(messages);

      console.log("Received response from LLM.");

      messages.push(...newMessages);

      ws.send(JSON.stringify(responseMessage));
    });
  });

  console.log(`WebSocket server running on ws://localhost:${PORT}`);
}
