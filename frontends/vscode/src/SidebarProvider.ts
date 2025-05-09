import * as vscode from "vscode";
import { enableWebsocketPolyfill } from "./shared/websocket-polyfill";
import { connect, sendCoreMessage, sendSetCwdMessage } from "./shared/message";
import { CoreMessage } from "ai";
import { handleMessage } from "./handle-message";

export class SidebarProvider implements vscode.WebviewViewProvider {
    _view?: vscode.WebviewView;
    _doc?: vscode.TextDocument;

    constructor(private readonly _extensionUri: vscode.Uri) { }

    public resolveWebviewView(webviewView: vscode.WebviewView) {
        this._view = webviewView;

        webviewView.webview.options = {
            // Allow scripts in the webview
            enableScripts: true,

            localResourceRoots: [this._extensionUri],
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        const ws = enableWebsocketPolyfill().then(() => connect((message) => {
            if (this._view?.webview) {
                handleMessage(message, this._view?.webview);
            } else {
                console.warn("webview missing");
            }
        })).then((ws) => {
            const workspaceFolder = vscode.workspace.workspaceFolders?.[0];

            if (workspaceFolder) {
                const folderPath = workspaceFolder.uri.fsPath;

                console.log('Workspace folder path:', folderPath);

                sendSetCwdMessage(ws, folderPath);
            } else {
                console.log("workspaceFolder not found, can't set cwd");
            }

            return ws;
        });

        // Listen for messages from the Sidebar component and execute action
        webviewView.webview.onDidReceiveMessage(async (data) => {
            switch (data.type) {
                case "sendChatMessage": {
                    sendCoreMessage(await ws, {
                        role: "user",
                        content: data.value
                    });

                    break;
                }
                case "onError": {
                    if (!data.value) {
                        return;
                    }

                    vscode.window.showErrorMessage(data.value);
                    break;
                }
            }
        });

    }

    public revive(panel: vscode.WebviewView) {
        this._view = panel;
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        const styleResetUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, "media", "reset.css")
        );
        const styleVSCodeUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, "media", "vscode.css")
        );
        const scriptUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, "webviews", "sidebar.js")
        );
        const styleMainUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, "media", "sidebar.css")
        );

        // Use a nonce to only allow a specific script to be run.
        const nonce = getNonce();

        return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
        -->
        <meta http-equiv="Content-Security-Policy" content="img-src https: data:; style-src 'unsafe-inline' ${webview.cspSource
            }; script-src 'nonce-${nonce}';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${styleResetUri}" rel="stylesheet">
				<link href="${styleVSCodeUri}" rel="stylesheet">
                <link href="${styleMainUri}" rel="stylesheet">
                <script nonce="${nonce}">
                    const tsvscode = acquireVsCodeApi();
                </script>

			</head>
            <body>
                <div class="chat-container">
                    <div id="chat-messages"></div>
                    <form id="chat-form">
                        <input type="text" id="chat-input" class="chat-input" placeholder="Type your message..." required>
                        <button type="submit" class="chat-submit">Send</button>
                    </form>
                </div>
                <script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`;
    }
}

function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
