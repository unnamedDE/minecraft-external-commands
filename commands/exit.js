const _command = 'exit';
const { app } = require('electron');

module.exports = class exit {
  isThisCommand(command) {
    return command === _command;
  }
  run(args, fullCmd) {
    app.quit();
  }
}
