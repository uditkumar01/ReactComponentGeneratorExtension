// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { commands, ExtensionContext, Uri, window } from "vscode";
import createComponent from "./commands/createComponent";
import { prefix } from "./constants";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = commands.registerCommand(
    "react-component-generator.helloWorld",
    (uri?: Uri) => {
      createComponent(context, uri);
    }
  );

  context.subscriptions.push(disposable);

  disposable = commands.registerCommand(
    "react-component-generator.resetRCGSettings",
    (uri?: Uri) => {
      try {
        context.workspaceState.keys().forEach((key) => {
          if (key.startsWith(prefix)) {
            context.workspaceState.update(key, undefined);
          }
        });

        window.showInformationMessage("Settings reset successfully");
      } catch (error: any) {
        window.showErrorMessage(
          "Error while resetting settings. Please try again"
        );

        console.log(error);
      }
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
