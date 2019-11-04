const _command = 'open-link';

const opn = require('opn');

module.exports = class openLink {
  isThisCommand(command) {
    return command === _command;
  }
  run(args, fullCmd) {
    let link = args[0];
    if(!/:/.test(link)) link = `http://${link}`;
    opn(link).then().catch(e => console.log(e));
  }
}
