import * as vscode from 'vscode';
import { sendMessage } from "./shared/message";

const chatChandler: vscode.ChatRequestHandler = async (request, context, stream, token) => {
	console.log(request.prompt);

	sendMessage();
};

export function activate(context: vscode.ExtensionContext) {
	console.log('extension "atyper" is now active!');

	const participant = vscode.chat.createChatParticipant('chat.atyper', chatChandler);

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('atyper.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from atyper!');
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {
	//
}
