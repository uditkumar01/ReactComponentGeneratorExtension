import { Uri } from "vscode";
import { boilerplate } from "../templates";

export interface IComponentMetaData {
  name: string;
  content: string;
  filePath: Uri;
  dirPath: Uri;
}

const getComponentMetaData = (
  componentDirURI: Uri,
  componentName: string,
  componentType: string,
  tsDetected: boolean
): IComponentMetaData => {
  const data = {
    name: `${componentName}.${tsDetected ? "tsx" : "jsx"}`,
    content:
      boilerplate?.[tsDetected ? "ts" : "js"]?.[componentType]?.(
        componentName
      ) ?? "",
  };

  return {
    ...data,
    filePath: Uri.joinPath(componentDirURI, componentName, data.name),
    dirPath: Uri.joinPath(componentDirURI, componentName),
  };
};

export default getComponentMetaData;
