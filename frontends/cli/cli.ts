import { enableWebsocketPolyfill } from "../vscode/src/shared/websocket-polyfill";
import { connect, MessageQuestion, sendCoreMessage, sendQuestionResponseMessage, sendSetCwdMessage } from "../vscode/src/shared/message";
import { CoreMessage } from "ai";
import { ask, askYesOrNo } from "./ask";

type MessageCallback = (message: CoreMessage) => void;

const startCli = async () => {
  let messageCallbacks: MessageCallback[] = [];

  const ws = await connect(async (message) => {
    console.log("received message " + message.type);
    console.log(JSON.stringify(message));
    if (message.type === "coreMessage") {
      messageCallbacks.forEach(callback => {
        callback(message.data as CoreMessage);
      });
      messageCallbacks = [];
    } else if (message.type === "question") {
      const question = message as MessageQuestion;
      const answer = await askYesOrNo(question.data.question);

      sendQuestionResponseMessage(ws, question.data.questionId, answer);
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
    const userInput = await ask("you: ");
    console.log("x");
    const receivePromise = receiveMessage();

    sendCoreMessage(ws, {
      role: "user",
      content: userInput,
    });

    console.log("waiting to receive message");
    const { content } = await receivePromise;

    if (content) {
      console.log("atyper: " + content);
    }
  }
};

enableWebsocketPolyfill().then(() => startCli()).catch(console.error);
