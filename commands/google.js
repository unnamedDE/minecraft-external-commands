const _command = 'google';

const opn = require('opn');

module.exports = class google {
  isThisCommand(command) {
    return command === _command;
  }
  run(args, fullCmd) {
    opn('https://www.google.com/search?q=' + args.join('%20'))
  }
}
