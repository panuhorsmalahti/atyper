import { tool } from "ai";
import { z } from "zod";
import { join } from "path";
import { writeFile } from "fs/promises";

export const addFile = tool({
  description: "Add a new file.",
  parameters: z.object({
    filePath: z.string(),
    fileContents: z.string()
  }),
  execute: async ({ filePath, fileContents}) => {
    const cwd = process.cwd();
    const location = join(cwd, filePath);

    console.log("Adding file to " + location);

    await writeFile(location, fileContents);
  },
});
