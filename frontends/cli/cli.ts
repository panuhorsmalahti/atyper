import * as readline from "node:readline/promises";
import { sendMessage } from "../vscode/src/shared/message";
import * as ora from "ora";

const startCli = async () => {
  const terminal = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  while (true) {
    const userInput = await terminal.question("you: ");

    const spinner = ora.default({
      discardStdin: false
    }).start();

    const response = await sendMessage({
      role: "user",
      content: userInput,
    });

    spinner.stop();

    console.log("atyper: " + response.content);
  }
};

startCli().catch(console.error);
