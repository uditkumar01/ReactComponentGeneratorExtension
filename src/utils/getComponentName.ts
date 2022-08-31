import { window } from "vscode";
import toTitleCase from "./toTitleCase";

const getComponentName = async () => {
  let componentName = await window.showInputBox({
    placeHolder: "Type the name of your react component ...",
  });

  if (!componentName) {
    throw new Error("No component name given");
  }

  componentName = toTitleCase(componentName);

  return componentName;
};

export default getComponentName;
