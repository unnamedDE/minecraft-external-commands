const electron = require('electron');
const {
  app,
  BrowserWindow,
  Menu,
  Tray
} = electron;

const fs = require('fs');
const chokidar = require('chokidar');
require('dotenv').config();

const config = require('./config')



let commands = [];

let tray = null;

app.on('ready', () => {

  tray = new Tray(app.getAppPath() + '/assets/icon/icon.png');
  tray.setToolTip('Minecraft External Commands');
  tray.setContextMenu(Menu.buildFromTemplate([
    {
      label: 'Exit',
      click: () => {
        app.quit();
      }
    }
  ]));

  // Aktionen
  const logPath = `${config.path}/logs/latest.log`


  loadCommands(`${__dirname}/commands`)

  chokidar.watch(logPath, {persistent: true, usePolling: true}).on('change', (path, event) => {
    fs.readFile(logPath, 'utf8', (err, data) => {
      if(err) return console.log(err);
      const lines = data.split('\n')
      if(!lines[lines.length - 2]) return;
      const fullCommand = lines[lines.length - 2]
                          .replace(/\[\d{2}:\d{2}:\d{2}\]\s\[main\/INFO\]:\s\[CHAT\]\s\/(.+?)<--\[HERE\]/, '$1 ');
      const command = fullCommand.split(' ')[0];
      const commandArgs = fullCommand.replace(new RegExp('^' + command + ' '), '').split(' ').filter(e => e != '\r');

      if(command != 'node') return;

      const cmd = commandArgs[0];
      const args = commandArgs.splice(1);

      handleCommand(cmd, args, fullCommand)

    });
  });

});

function loadCommands(commandsPath) {
  if(!config || !config.commands.length === 0) return;

  for(const commandName of config.commands) {
    const commandsClass = require(`${commandsPath}/${commandName}`);

    const command = new commandsClass();

    commands.push(command);
  }
}

async function handleCommand(cmd, args, fullCmd) {
  for(const commandClass of commands) {
    try {
      if(!commandClass.isThisCommand(cmd)) continue;

      console.log(cmd, args.join(' '))

      await commandClass.run(args, fullCmd);
    } catch (e) {
      console.log(e);
    }
  }
}
