import { TextEncoder } from "util";
import { window, workspace } from "vscode";
import { IComponentMetaData } from "./getComponentMetaData";

const addComponentFiles = async (
  componentMetaData: IComponentMetaData,
  componentName: string,
  tsDetected: boolean
) => {
  const dirPath = componentMetaData.dirPath;

  const filePath = componentMetaData.filePath;

  if (!filePath || !dirPath) {
    throw new Error("Component path not found");
  }

  // checking if the component directory exists with similar name
  const checkIfExists = await workspace.findFiles(
    `**/${componentName}.${tsDetected ? "tsx" : "jsx"}`
  );

  if (checkIfExists.length > 0) {
    await window.showErrorMessage(
      `Component ${componentName} already exists in ${workspace.asRelativePath(
        checkIfExists[0]
      )}`
    );

    throw new Error("Component already exists");
  }

  if (dirPath) {
    await workspace.fs.createDirectory(dirPath);
  }

  await workspace.fs.writeFile(
    filePath,
    new TextEncoder().encode(componentMetaData.content)
  );
};

export default addComponentFiles;
