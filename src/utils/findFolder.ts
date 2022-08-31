import { Uri, workspace } from "vscode";
import readdirp = require("readdirp");

const findFolder = async (regexStr: string, depth: number, basePath?: Uri) => {
  let dir: Uri | undefined;
  const re = new RegExp(regexStr, "gi");

  for (const folder of workspace.workspaceFolders ?? []) {
    for await (const entry of readdirp(basePath?.fsPath ?? folder.uri.fsPath, {
      directoryFilter: ["!.git", "!node_modules"],
      type: "directories",
      depth,
    })) {
      const { path, basename } = entry;
      if (re.test(basename)) {
        dir = Uri.joinPath(folder.uri, path);
        break;
      }
    }
  }

  return dir;
};

export default findFolder;
