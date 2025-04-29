import type WebSocket from "ws";
import { addFile } from "./add-file";
import { readRepository } from "./read-repository";
import { Questions } from "../server";

export const getTools = (ws: WebSocket, questions: Questions) => ({ addFile: addFile(ws, questions), readRepository });
