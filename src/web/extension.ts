import * as vscode from "vscode";
import { MainPanel } from "./panels/main";

export function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "chess" is now active in the web extension host!'
  );

  const panel = vscode.commands.registerCommand("chess.startChessGame", () => {
    vscode.window.showInformationMessage("Started a new chess game");
    MainPanel.render(context.extensionUri);
  });

  context.subscriptions.push(panel);

  const test = vscode.commands.registerCommand("chess.test", () => {
    vscode.window.showInformationMessage("Started a new game");
  });
  context.subscriptions.push(test);
}

export function deactivate() {}
