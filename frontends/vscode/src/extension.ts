import * as vscode from 'vscode';
import { SidebarProvider } from './SidebarProvider';

export function activate(context: vscode.ExtensionContext) {
	console.log('extension "atyper" is now active!');

	const sidebarProvider = new SidebarProvider(context.extensionUri);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(
			"atyper-sidebar",
			sidebarProvider
		)
	);

	const disposable = vscode.commands.registerCommand('atyper.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from atyper!');
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {
	//
}
