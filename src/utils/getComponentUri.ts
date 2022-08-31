import { Uri, window } from "vscode";
import createComponentsDir from "./createComponentsDir";
import findFolder from "./findFolder";

const getComponentUri = async (dir?: Uri) => {
  let componentDirURI = dir;

  const strPath = componentDirURI?.fsPath;
  const re = new RegExp(/components?\/?$/gi);

  if (!strPath || !re.test(strPath)) {
    componentDirURI = await findFolder("^components?$", 5);
  }

  if (componentDirURI === undefined) {
    const userRes = await window.showInformationMessage(
      "No `components` folder found, do you want to create a new one?",
      ...["Yes", "No"]
    );
    if (userRes === "Yes") {
      componentDirURI = await createComponentsDir();
    } else {
      throw new Error("No `components` folder found");
    }
  }

  if (!componentDirURI) {
    throw new Error("Component directory not found");
  }

  return componentDirURI;
};

export default getComponentUri;
