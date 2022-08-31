import { existsSync } from "fs";
import { Uri, window, workspace } from "vscode";
import findFolder from "./findFolder";

const createComponentsDir = async () => {
  let workspaceDir: Uri | undefined;
  workspaceDir = (await window.showWorkspaceFolderPick())?.uri;
  if (workspaceDir === undefined) {
    throw new Error("No File Selected !!!");
  }
  // check if workspaceDir is a valid react project
  const packageJsonFileExists = existsSync(
    Uri.joinPath(workspaceDir, "package.json").fsPath
  );

  console.log(
    { packageJsonFileExists },
    Uri.joinPath(workspaceDir, "package.json").fsPath
  );

  if (!packageJsonFileExists) {
    window.showErrorMessage(
      "Not a valid react project. No package.json file found !!!"
    );
    throw new Error("Not a valid react project\nNo package.json file found");
  }

  const packageJson = await workspace.fs.readFile(
    Uri.joinPath(workspaceDir, "package.json")
  );

  const packageJsonObj = JSON.parse(packageJson.toString());

  const isReactProject = packageJsonObj?.dependencies?.react;

  if (!isReactProject) {
    const userRes = await window.showWarningMessage(
      "Selected folder is not a valid react project. Do you still want to proceed?",
      "Yes",
      "No"
    );
    if (userRes === undefined && userRes === "No") {
      throw new Error("Not a valid react project");
    }
  }

  const srcDir = await findFolder("^src$", 1, workspaceDir);
  if (srcDir) {
    workspaceDir = srcDir;
  }

  const componentDirURI = Uri.joinPath(workspaceDir, "components");
  workspace.fs.createDirectory(componentDirURI);

  return componentDirURI;
};

export default createComponentsDir;
