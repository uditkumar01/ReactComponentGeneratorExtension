import { existsSync } from "fs";
import { join } from "path";
import { TextEncoder } from "util";
import { Uri, workspace } from "vscode";

const addExportStatement = async (
  componentDirURI: Uri,
  componentName: string,
  tsDetected: boolean
) => {
  const indexFileName = `./index.${tsDetected ? "ts" : "js"}`;

  // check if ./index.js or ./index.ts exists
  const indexFileExists = existsSync(
    join(componentDirURI.fsPath, indexFileName)
  );

  const exportStatement = `export { ${componentName} } from "./${componentName}/${componentName}";\n`;

  const indexFilePath = Uri.joinPath(componentDirURI, indexFileName);
  if (indexFileExists) {
    const oldIndexExports = await workspace.fs.readFile(indexFilePath);

    // add new export to index file by editing the file
    await workspace.fs.writeFile(
      indexFilePath,
      new TextEncoder().encode(oldIndexExports + exportStatement)
    );
  } else {
    workspace.fs.writeFile(
      indexFilePath,
      new TextEncoder().encode(exportStatement)
    );
  }
};

export default addExportStatement;
