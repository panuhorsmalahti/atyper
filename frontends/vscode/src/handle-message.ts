import * as vscode from "vscode";
import { CoreMessage } from "ai";
import { Message } from "./shared/message";

export const handleMessage = async (
  message: Message,
  webview: vscode.Webview
) => {
  if (message.type === "coreMessage") {
    const { content } = message.data as CoreMessage;

    if (content) {
      await webview.postMessage({
        type: "chatMessageResponse",
        value: content,
      });
    }
  } else if (message.type === "question") {
    await webview.postMessage({
      type: "question",
      value: message.data,
    });
  } else {
    console.warn("Unknown message type " + message.type);
  }
};
