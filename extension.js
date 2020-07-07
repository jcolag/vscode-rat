// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log('Congratulations, your extension "vscode-rat" is now active!');
  
  vscode.workspace.onDidSaveTextDocument((document) => {
    const file = document.fileName;
    vscode.window.showInformationMessage(`Saved ${file}`);
  });

  vscode.workspace.onDidOpenTextDocument((document) => {
    const file = document.fileName;
    vscode.window.showInformationMessage(`Opened ${file}`);
  });

  vscode.workspace.onDidChangeTextDocument((changes) => {
    const file = changes.document.fileName;
    console.log(JSON.stringify(changes));
    vscode.window.showInformationMessage(`Modified ${file}`);
  });
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
