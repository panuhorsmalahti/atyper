import import2 from "import2";
import { is_node } from "tstl";

export const enableWebsocketPolyfill = async () => {
  if (is_node()) {
    (global as any).WebSocket ??= (await import2("ws") as any).WebSocket;
  }
};
