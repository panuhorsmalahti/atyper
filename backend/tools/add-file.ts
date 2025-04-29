import { tool } from "ai";
import { z } from "zod";
import { join } from "path";
import { writeFile } from "fs/promises";
import { askQuestion } from "../send-message";
import type WebSocket from "ws";
import { Questions } from "../server";

export const addFile = (ws: WebSocket, questions: Questions) => tool({
  description: "Add a new file.",
  parameters: z.object({
    filePath: z.string(),
    fileContents: z.string()
  }),
  execute: async ({ filePath, fileContents}) => {
    const cwd = process.cwd();
    const location = join(cwd, filePath);
    const fileAccepted = await askQuestion(questions, ws, "Do you accept file " + filePath, fileContents);

    if (fileAccepted) {
      console.log("Adding file to " + location);

      await writeFile(location, fileContents);
    } else {
      console.log("File " + location + " not accepted by user");
    }

    return {
      fileAccepted
    }
  },
});
