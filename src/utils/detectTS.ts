import readdirp = require("readdirp");
import { Uri, workspace } from "vscode";

const detectTS = async () => {
  let tsDetected: boolean = false;

  for (const folder of workspace.workspaceFolders ?? []) {
    for await (const entry of readdirp(folder.uri.fsPath, {
      fileFilter: ["**/*.ts", "**/*.tsx"],
      directoryFilter: ["!.git", "!node_modules"],
      type: "files",
      depth: 10,
    })) {
      const { basename } = entry;

      if (basename.endsWith(".ts") || basename.endsWith(".tsx")) {
        tsDetected = true;
        break;
      }
    }
  }

  return tsDetected;
};

export default detectTS;
