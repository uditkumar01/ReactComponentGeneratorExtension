const fs = require("fs");
const pathPkg = require("path");

function checkIfFileExists(filePath) {
    return fs.existsSync(filePath);
}

function getFileExtension(fileFullName) {
    return pathPkg.extname(fileFullName).replace(".", "");
}

function toCamelCase(oldStr) {
    return oldStr.replace(/\W/g, " ").replace(/_/g, " ").split(" ").map((piece) => {
        if (piece.length) {
            return piece[0].toUpperCase() + piece.slice(1, piece.length);
        }
    }).join("");
}

function toHypenCase(oldStr) {
    return oldStr.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

function writeThisText(path, fileTextToBeWritten) {

    fs.writeFile(path, fileTextToBeWritten, err => {
        if (err) console.log(`Failed to create file: ${err}`);
        else console.log("File created.");
    });
}

function formatExports(allExports) {
    return allExports.split(';').map(piece => {
        return piece.trim();
    }).join(';\n');
}

function createFilesInsideFolder(userCommandSelection, componentName, componentNameWithHypen, path, ext) {

    // JSX file text With CSS
    const componentJSXFileTextWithCSS = `import "./${componentName}.css";

export function ${componentName}() {
    return (
        <div className="${componentNameWithHypen}">
        </div>
    );
}`;

    // JSX file text WithOut CSS
    const componentJSXFileTextWithOutCSS =
        `export function ${componentName}() {
    return (
        <div className="${componentNameWithHypen}">
        </div>
    );
}`;

    // TEST file text
    const textOfTestFile = `import { render, screen } from '@testing-library/react';

test('test message', () => {
    // write your test here
});`

    // CSS file text
    const textOfCSSFile = `.${componentNameWithHypen}{
}`

    if (userCommandSelection.description === "* with only css file") {

        writeThisText(pathPkg.join(path, "src", "components", componentName, `${componentName}.${ext}x`), componentJSXFileTextWithCSS);

        writeThisText(pathPkg.join(path, "src", "components", componentName, `${componentName}.css`), textOfCSSFile);


    } else if (userCommandSelection.description === "* with only test file") {

        writeThisText(pathPkg.join(path, "src", "components", componentName, `${componentName}.${ext}x`), componentJSXFileTextWithOutCSS);

        writeThisText(pathPkg.join(path, "src", "components", componentName, `${componentName}.test.${ext}x`), textOfTestFile);


    } else if (userCommandSelection.description === "* with css and test files") {

        writeThisText(pathPkg.join(path, "src", "components", componentName, `${componentName}.${ext}x`), componentJSXFileTextWithCSS);

        writeThisText(pathPkg.join(path, "src", "components", componentName, `${componentName}.css`), textOfCSSFile);

        writeThisText(pathPkg.join(path, "src", "components", componentName, `${componentName}.test.${ext}x`), textOfTestFile);

    } else {

        writeThisText(pathPkg.join(path, "src", "components", componentName, `${componentName}.${ext}x`), componentJSXFileTextWithOutCSS);

    }

    if (!checkIfFileExists(pathPkg.join(path, "src", "components", `index.${ext}`))) {

        fs.writeFile(pathPkg.join(path, "src", "components", `index.${ext}`), ``, err => {
            if (err) {
                console.log(`Failed to create file: ${err}`);
            }
            else {
                fs.readFile(pathPkg.join(path, "src", "components", `index.${ext}`), 'utf8', (err, data) => {
                    if (err) {
                        console.error(err)
                    }
                    else {
                        let updatedData = data + `export { ${componentName} } from "./${componentName}/${componentName}";\n`;


                        writeThisText(pathPkg.join(path, "src", "components", `index.${ext}`), formatExports(updatedData));
                    }
                });
            }
        });
    } else {
        fs.readFile(pathPkg.join(path, "src", "components", `index.${ext}`), 'utf8', (err, data) => {
            if (err) {
                console.error(err)
            }
            else {
                let updatedData = data + `export { ${componentName} } from "./${componentName}/${componentName}";\n`;


                writeThisText(pathPkg.join(path, "src", "components", `index.${ext}`), formatExports(updatedData));
            }
        });
    }

}

function createComponent(userCommandSelection, path, extension = "JavaScript") {

    console.log(userCommandSelection);
    const ext = extension.toLowerCase() === "javascript" ? "js" : "ts";
    const componentName = toCamelCase(userCommandSelection.label);
    const componentNameWithHypen = toHypenCase(componentName);
    try {
        if (checkIfFileExists(pathPkg.join(path, "src"))) {

            // creating components folder if is doesn't exists
            if (!checkIfFileExists(pathPkg.join(path, "src", "components"))) {
                console.log("callback out");
                fs.mkdir(pathPkg.join(path, `src`, 'components'), (err) => {
                    if (err) {
                        return console.log(err);
                    } else {
                        // after components if created creating the component Folder
                        if (!checkIfFileExists(pathPkg.join(path, "src", "components", componentName))) {

                            fs.mkdir(pathPkg.join(path, "src", "components", componentName), (err) => {
                                if (err) {
                                    return console.log(err, "error while creating folder");
                                } else {
                                    createFilesInsideFolder(userCommandSelection, componentName, componentNameWithHypen, path, ext);
                                }
                            });
                        }
                    }
                });
                console.log("callback in");

            } else {

                // creating the component Folder
                if (!checkIfFileExists(pathPkg.join(path, "src", "components", componentName))) {

                    fs.mkdir(pathPkg.join(path, "src", "components", componentName), (err) => {
                        if (err) {
                            return console.log(err, "error while creating folder");
                        } else {
                            createFilesInsideFolder(userCommandSelection, componentName, componentNameWithHypen, path, ext);
                        }
                    });
                }
            }



            return { success: true };
        } else {
            return { success: false, error: `src folder not found at ${pathPkg.join(path, "src")}` };
        }
    } catch (err) {
        console.log(err.message);
    }
}

module.exports = {
    createComponent,
    checkIfFileExists,
    getFileExtension,
    writeThisText
};