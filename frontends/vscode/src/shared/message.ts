import { CoreMessage } from "ai";
import { request } from "http";

export const PORT = 54562;

export const sendMessage = async (message: CoreMessage): Promise<CoreMessage> =>
  new Promise((resolve, reject) => {
    const data = JSON.stringify(message);
    const options = {
      hostname: "localhost",
      port: PORT,
      path: "/message",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Content-Length': data.length
      },
    };

    const req = request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        const responseMessage = JSON.parse(data) as CoreMessage;
        
        resolve(responseMessage);
      });
    });

    req.on("error", (error) => {
      console.error(`Problem with request: ${error.message}`);

      reject(error);
    });

    req.write(data);

    req.end();
  });
