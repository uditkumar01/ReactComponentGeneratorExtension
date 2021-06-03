const fs = require('fs');
const pathPkg = require("path");
const { writeThisText, createComponent, checkIfFileExists } = require('./createComponent');

function tryCatchFun(callback) {
    try {
        callback();
        //file removed
    } catch (err) {
        console.error(err.message);
    }
}

function cleanTemplate(path, ext) {

    const indexFileText = `<!DOCTYPE html>
<html lang='en'>
    <head>
        <meta charset='utf-8' />
        <link rel='icon' href='%PUBLIC_URL%/favicon.ico' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta name='theme-color' content='#000000' />
        <meta
            name='description'
            content='Web site created using create-react-app'
        />
        <link rel='manifest' href='%PUBLIC_URL%/manifest.json' />
        <title>React App</title>
    </head>
    <body>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <div id='root'></div>
    </body>
</html>`

    const publicRemove = [`favicon.ico`, `logo192.png`, `logo512.png`, `index.html`];
    const srcRemove = [`logo.svg`, `App.test.js`, `App.test.jsx`, `App.js`, `App.jsx`, `App.test.ts`, `App.test.tsx`, `App.ts`, `App.tsx`, `App.css`];

    console.log(srcRemove);

    srcRemove.map((fileItem) => {
        tryCatchFun(() => {
            fs.unlinkSync(pathPkg.join(path, `src`, fileItem));
        });
    });

    publicRemove.map((fileItem) => {
        tryCatchFun(() => {
            fs.unlinkSync(pathPkg.join(path, `public`, fileItem));
        });
    });

    writeThisText(pathPkg.join(path, `public`, `index.html`), indexFileText);

    let srcIndexFileExt = "";

    if (checkIfFileExists(pathPkg.join(path, `src`, `index.js`))) {
        srcIndexFileExt = "js";
    } else if (checkIfFileExists(pathPkg.join(path, `src`, `index.jsx`))) {
        srcIndexFileExt = "jsx";
    } else if (checkIfFileExists(pathPkg.join(path, `src`, `index.tsx`))) {
        srcIndexFileExt = "tsx";
    } else {
        srcIndexFileExt = "ts";
    }

    fs.readFile(pathPkg.join(path, `src`, `index.${srcIndexFileExt}`), 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }

        const updatedData = data.split("\n").map(line => {
            return !line.includes("import App from") ?
                line :
                `import { App } from "./Components/index";`;
        }).join("\n");

        writeThisText(pathPkg.join(path, `src`, `index.${srcIndexFileExt}`), updatedData);

    });

    createComponent(
        {
            label: `App`,
            description: `* with css and test files`,
        },
        path,
        ext === "js" ? "JavaScript" : "TypeScript",
    );

}

module.exports = {
    cleanTemplate
};