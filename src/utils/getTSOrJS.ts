import { ExtensionContext, window } from "vscode";
import { prefix } from "../constants";
import detectTS from "./detectTS";

const getTSOrJS = async (context: ExtensionContext) => {
  let tsDetectedLS: boolean | undefined = await context.workspaceState.get(
    `${prefix}TSDetected`
  );

  let tsDetected: boolean = tsDetectedLS === true;

  if (tsDetectedLS === undefined) {
    const tsDetectedRes = await window.showQuickPick([
      "TypeScript",
      "JavaScript",
    ]);

    if (tsDetected === undefined) {
      tsDetected = await detectTS();
    } else {
      tsDetected = tsDetectedRes === "TypeScript";
      context.workspaceState.update(`${prefix}TSDetected`, tsDetected);
    }
  }

  return tsDetected;
};

export default getTSOrJS;
