import * as readline from "node:readline/promises";
import { sendMessage } from "./message";

const startCli = async () => {
  const terminal = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  while (true) {
    const userInput = await terminal.question("You: ");
    const response = await sendMessage({
      role: "user",
      content: userInput,
    });

    console.log("Assistant: " + response.content);
  }
};

startCli().catch(console.error);
