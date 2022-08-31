import { ExtensionContext, window } from "vscode";
import { prefix } from "../constants";

const getComponentType = async (context: ExtensionContext) => {
  let componentType: string | undefined = await context.workspaceState.get(
    `${prefix}ComponentType`
  );

  if (!componentType) {
    const componentTypeRes = await window.showQuickPick([
      {
        label: "arrow",
        description: "Arrow Function Component (default)",
      },
      {
        label: "regular",
        description: "Regular Function Component",
      },
      {
        label: "class",
        description: "Class Based Component",
      },
    ]);

    componentType = componentTypeRes?.label ?? "arrow";

    if (componentType === "class") {
      componentType = "classC";
    } else {
      componentType = `${componentType}FC`;
    }

    context.workspaceState.update(`${prefix}ComponentType`, componentType);
  }

  return componentType;
};

export default getComponentType;
