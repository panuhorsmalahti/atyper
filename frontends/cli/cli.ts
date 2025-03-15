import * as readline from "node:readline/promises";
import { enableWebsocketPolyfill } from "../vscode/src/shared/websocket-polyfill";
import { connect, sendCoreMessage, sendSetCwdMessage } from "../vscode/src/shared/message";
import { CoreMessage } from "ai";

type MessageCallback = (message: CoreMessage) => void;

const startCli = async () => {
  const terminal = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  let messageCallbacks: MessageCallback[] = [];

  const ws = await connect((message) => {
    if (message.type === "coreMessage") {
      messageCallbacks.forEach(callback => {
        callback(message.data as CoreMessage);
      });
      messageCallbacks = [];
    } else {
      console.log("Unknown message type " + message.type);
    }
  });

  sendSetCwdMessage(ws, process.cwd());

  const receiveMessage = () => new Promise<CoreMessage>((resolve) => {
    messageCallbacks.push((message) => {
      resolve(message);
    });
  });

  while (true) {
    const userInput = await terminal.question("you: ");

    sendCoreMessage(ws, {
      role: "user",
      content: userInput,
    });

    const response = await receiveMessage();

    console.log("atyper: " + response.content);
  }
};

enableWebsocketPolyfill().then(() => startCli()).catch(console.error);
