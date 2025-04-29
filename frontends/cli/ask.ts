/* export const ask = async (terminal: Interface, question: string) => {
  const answer = await terminal.question(question + " [Y/n]?");

  return answer.toLocaleLowerCase().startsWith("y");
}; */

import { createInterface } from "readline";

export const ask = (question: string) => {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise<string>((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);

      rl.close();
    });
  });
};

export const askYesOrNo = async (question: string) => {
  const answer = await ask(`${question} [Y/n]?`);

  return answer.toLocaleLowerCase().startsWith("y");
};
