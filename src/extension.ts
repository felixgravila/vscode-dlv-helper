'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "dlv-helper" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json


    let disposable = vscode.commands.registerCommand('dlvhelper.runselect', () => {
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            return; // No open text editor
        }
        let document = editor.document.fileName;
        let filename = path.basename(document);
        let extension = path.extname(document);
        if(extension !== ".dl") {
            return;
        }

        // vscode.window.showInformationMessage(filename);

        let csl = vscode.window.activeTerminal || vscode.window.createTerminal("dlv");
        csl.show(true);

        let selection = editor.selection;
        let text = editor.document.getText(selection);

        let singlewordregex = /^([a-zA-Z0-9]+)$/g;
        let singleword = (text.match(singlewordregex) || []).map(e => e.replace(singlewordregex, '$1'));
        if(singleword.length === 1 && singleword[0] === text) {
            //only one word selected
            csl.sendText('dlv '+document+' -filter="'+singleword[0]+'"');
        } else {

            let rgx = / *([a-z][a-zA-Z0-9]*) *\([A-Z][a-zA-Z0-9,]*\) *:-/g;
            let matches = (text.match(rgx) || []).map(e => e.replace(rgx, '$1'));

            let args = "";
            for (let fltr of matches) {
                args = args + ' -filter="' + fltr + '"';
            }

            csl.sendText("dlv "+document+args);
        }


    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}