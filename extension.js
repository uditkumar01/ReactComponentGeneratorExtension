// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const fs = require("fs");
const pathPkg = require("path");
const {
	createComponent,
	checkIfFileExists,
	getFileExtension,
} = require("./utils/createComponent");

const { cleanTemplate } = require("./utils/cleanTemplate");

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	let disposable = vscode.commands.registerCommand(
		"react-component-generator.helloWorld",
		async function () {

			let path = await vscode.window.showWorkspaceFolderPick();

			path = path.uri.fsPath;
			// path = `${process.cwd()}/idhertest`;
			
			// console.log(path, "my path");
			
			let fileTypeOption = [
				{
					label: "*",
					description: "type something to begin",
				},
			];

			let initialExt = "js";

			if (checkIfFileExists(`${pathPkg.join(path, 'src')}`)) {
				console.log("non-break");
				try {
					fs.readdirSync(`${path}/src`).find((file) => {
						const fileExt = getFileExtension(file);
						initialExt = fileExt;
						return fileExt === "ts";
					});
				} catch (err) {
					console.log(err.message);
				}
			} else {
				console.log("breaking due to error");
				vscode.window.showErrorMessage(
					`Hi, We failed to find src folder at path: ${pathPkg.join(path, "src")}`
				);
				return;
			}

			let scriptOptions =
				initialExt.toLowerCase() === "ts"
					? [
						{
							label: "TypeScript",
							description: "generate TypeScript Template",
						},
						{
							label: "JavaScript",
							description: "generate JavaScript Template",
						},
						{
							label: "Clean Template",
							description: "Clean Template",
						},
					]
					: [
						{
							label: "JavaScript",
							description: "generate JavaScript Template",
						},
						{
							label: "TypeScript",
							description: "generate TypeScript Template",
						},
						{
							label: "Clean Template",
							description: "Cleans your initial create react app template",
						},
					];
			const scriptSelection = await vscode.window.showQuickPick(
				scriptOptions,
				{
					matchOnDetail: true,
				}
			);

			if(scriptSelection.label.toLowerCase() === "clean template"){
				cleanTemplate(path, initialExt);
				vscode.window.showInformationMessage(`Hi! your template is clean now!!!`);
				return;
			}

			const quickPick = vscode.window.createQuickPick();
			quickPick.matchOnDetail = true;
			quickPick.items = fileTypeOption;
			quickPick.show();
			quickPick.onDidChangeValue(async () => {
				if (quickPick.value) {
					fileTypeOption = [
						{
							label: quickPick.value,
							description:
								"* without css and test files [ DEFAULT ]",
						},
						{
							label: quickPick.value,
							description: "* with only css file",
						},
						{
							label: quickPick.value,
							description: "* with only test file",
						},
						{
							label: quickPick.value,
							description: "* with css and test files",
							details: "bole bole bole",
						},
					];
				}

				quickPick.items = fileTypeOption;
			});

			quickPick.onDidAccept(async () => {
				try {
					const userCommandSelection = quickPick.selectedItems[0];
					if (userCommandSelection.label !== "*") {


						createComponent(
							userCommandSelection,
							path,
							scriptSelection.label,
						);

						quickPick.hide();

						// Display a message box to the user
						vscode.window.showInformationMessage(
							"You are ready to go!"
						);
					}
				} catch (err) {
					// Display a message box to the user
					vscode.window.showErrorMessage(`${err.message}`);
					quickPick.hide();
				}
			});
		}
	);

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate,
};
