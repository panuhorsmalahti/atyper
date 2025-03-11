import * as readline from "node:readline/promises";
import { sendMessage } from "../vscode/src/shared/message";

const startCli = async () => {
  const terminal = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  while (true) {
    const userInput = await terminal.question("you: ");
    const response = await sendMessage({
      role: "user",
      content: userInput,
    });

    console.log("atyper: " + response.content);
  }
};

startCli().catch(console.error);
