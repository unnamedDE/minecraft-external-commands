const _command = 'log';

module.exports = class log {
  isThisCommand(command) {
    return command === _command;
  }
  run(args, fullCmd) {
    console.log(args.join(' '));
  }
}
