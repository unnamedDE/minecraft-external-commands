const _command = 'run';
const { spawn } = require('child_process');

module.exports = class run {
  isThisCommand(command) {
    return command === _command;
  }
  run(args, fullCmd) {
    try {
      const program = spawn(args.join(' '));
    } catch (e) {
      console.log(e);
    }
  }
}
