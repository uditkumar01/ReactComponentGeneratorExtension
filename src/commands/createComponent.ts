import { existsSync } from "fs";
import { join } from "path";
import { TextEncoder } from "util";
import {
  ExtensionContext,
  Position,
  Selection,
  Uri,
  ViewColumn,
  window,
  workspace,
} from "vscode";
import addComponentFiles from "../utils/addComponentFiles";
import addExportStatement from "../utils/addExportStatement";
import addSelections from "../utils/addSelections";
import getComponentMetaData from "../utils/getComponentMetaData";
import getComponentName from "../utils/getComponentName";
import getComponentType from "../utils/getComponentType";
import getComponentUri from "../utils/getComponentUri";
import getTSOrJS from "../utils/getTSOrJS";

const createComponent = async (context: ExtensionContext, dir?: Uri) => {
  try {
    let componentDirURI = await getComponentUri(dir);

    let componentName = await getComponentName();

    let componentType = await getComponentType(context);

    let tsDetected = await getTSOrJS(context);

    const componentMetaData = getComponentMetaData(
      componentDirURI,
      componentName,
      componentType,
      tsDetected
    );

    await addComponentFiles(componentMetaData, componentName, tsDetected);

    await addExportStatement(componentDirURI, componentName, tsDetected);

    await addSelections(componentMetaData, componentName);

    window.showInformationMessage(
      `Component ${componentName} created successfully!`
    );
  } catch (err: any) {
    console.log(err?.message);
  }
};

export default createComponent;
