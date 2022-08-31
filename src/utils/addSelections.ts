import { workspace, window, ViewColumn, Selection, Position } from "vscode";
import { IComponentMetaData } from "./getComponentMetaData";

const addSelections = async (
  componentMetaData: IComponentMetaData,
  componentName: string
) => {
  const doc = await workspace.openTextDocument(componentMetaData.filePath);

  const editor = await window.showTextDocument(doc, ViewColumn.One);

  let allSelections: Array<Selection> = [];

  await Promise.all(
    componentMetaData.content
      .split("\n")
      .map(async (rawStr: string, rowIndex: number) => {
        if (!componentName) {
          return;
        }
        let currIndex = rawStr.indexOf(componentName);
        while (currIndex !== -1) {
          const pos1 = new Position(rowIndex, currIndex);
          const pos2 = new Position(rowIndex, currIndex + componentName.length);
          const sel = new Selection(pos1, pos2);

          allSelections.push(sel);
          currIndex = rawStr.indexOf(
            componentName,
            currIndex + componentName.length
          );
        }
      })
  );

  editor.selections = allSelections;
};

export default addSelections;
