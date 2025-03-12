import { tool } from "ai";
import { z } from "zod";
import { runDefaultAction } from "repomix";
import { join } from "path";
import { readFile } from "fs/promises";

const repomixOutputFilename = "repomix-output.txt";

export const readRepository = tool({
  description: "Read the complete repository contents.",
  parameters: z.object({}),
  execute: async (_options) => {
    const cwd = process.cwd();
    const { packResult } = await runDefaultAction(["."], cwd, {});

    console.log(`repomix executed at ${cwd}:`);
    console.log(JSON.stringify(packResult));

    const repomixFile = join(cwd, repomixOutputFilename);
    const repomix = await readFile(repomixFile, "utf8");

    console.log(repomix)

    return repomix;
  },
});
