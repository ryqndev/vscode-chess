import * as vscode from "vscode";
import { MainPanel } from "./panels/main";

export function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "chess" is now active in the web extension host!'
  );

  const panel = vscode.commands.registerCommand("chess.startChessPuzzle", () => {
    vscode.window.showInformationMessage("Started a new chess puzzle");
    MainPanel.render(context.extensionUri);
  });

  context.subscriptions.push(panel);
}

export function deactivate() { }
