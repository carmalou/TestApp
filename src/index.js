const electron = require('electron')
const {app, BrowserWindow, Menu} = electron
var logIt = require('./writeLogs.js');

// this should be placed at top of main.js to handle setup events quickly
if (handleSquirrelEvent(app)) {
    // squirrel event handled and app will exit in 1000ms, so don't do anything else
    return;
}

const path = require('path')
const url = require('url')
const {ipcMain} = require('electron')
// need to include the autoupdater module to listen for events
const autoUpdater = electron.autoUpdater
const appVersion = require('./package.json').version
logIt('appVersion == ' + appVersion);
// this will change to whereever your files live in prod. maybe an S3 bucket or another fileshare
const updateFeed = 'http://localhost:8080/installer32'

autoUpdater.setFeedURL(updateFeed + '?v=' + appVersion);
autoUpdater.checkForUpdates(); // this is where electron will run a check for updates

autoUpdater.on('checking-for-update', function() {
  logIt('Checking for updates');
});

autoUpdater.on('update-available', function() {
  logIt('Update is available');
});

autoUpdater.on('update-not-available', function() {
  logIt('Update is not available');
});

autoUpdater.on('update-downloaded', function(response) {
  logIt('update downloaded!');
  // here you could either prompt your user to quit and install
  // or you could stop the app and run the install.
  // but you'll want the following method

  autoUpdater.quitAndInstall();
});

menuTemplate = 
[
  {
    label: 'File',
    submenu:
      [
        {
          label: 'Menu One',
          click: () => {
            openRegisterUser()
          }
        },
        {
          label: 'Exit',
          accelerator: 'CmdOrCtrl+W',
          role: 'close'
        }]
  },
  {
    label: 'View',
    submenu:
      [
        {
          label: 'Toggle Full Screen',
          accelerator: (function ()
          {
            if(process.platform === 'darwin')
            {
              return 'Ctrl+Command+F'
            }
            else
            {
              return 'F11'
            }
          })(),
          click: function (item, focusedWindow)
          {
            if (focusedWindow)
            {
              focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
            }
          }
        }]
  },
  {
    label: 'About',
    submenu:
      [
        {
          label: 'About',
          click: function (item, focusedWindow)
          {
            if (focusedWindow)
            {
              const options = {
                type: 'info',
                title: 'About Test App',
                buttons: ['Ok'],
                message: '(c) 2017 TestApp.'
              }
              electron.dialog.showMessageBox(focusedWindow, options, function () {})
            }
          }
        }]
  }]


// Keep a global reference so the garbage collector does not destroy our app
let mainWindow

function createWindow () {

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 550,
    height: 660,
    resizable: false,
  })

  // Load the index.html file
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'app-splash.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Set up the menu
  var menu = Menu.buildFromTemplate(menuTemplate)
  mainWindow.setMenu(menu)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}


// Create the window then the app is ready
app.on('ready', () => {
  createWindow()
  electron.powerMonitor.on('on-ac', () => {
    mainWindow.restore()
  })
  electron.powerMonitor.on('on-battery', () => {
    mainWindow.minimize()
  })
})

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Reopen the app on macOS
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})


function handleSquirrelEvent(application) {
    if (process.argv.length === 1) {
        return false;
    }

    const ChildProcess = require('child_process');
    const path = require('path');

    const appFolder = path.resolve(process.execPath, '..');
    const rootAtomFolder = path.resolve(appFolder, '..');
    const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
    const exeName = path.basename(process.execPath);

    const spawn = function(command, args) {
        let spawnedProcess, error;

        try {
            spawnedProcess = ChildProcess.spawn(command, args, {
                detached: true
            });
        } catch (error) {}

        return spawnedProcess;
    };

    const spawnUpdate = function(args) {
        return spawn(updateDotExe, args);
    };

    const squirrelEvent = process.argv[1];
    switch (squirrelEvent) {
        case '--squirrel-install':
        case '--squirrel-updated':
            // Optionally do things such as:
            // - Add your .exe to the PATH
            // - Write to the registry for things like file associations and
            //   explorer context menus

            // Install desktop and start menu shortcuts
            spawnUpdate(['--createShortcut', exeName]);

            setTimeout(application.quit, 1000);
            return true;

        case '--squirrel-uninstall':
            // Undo anything you did in the --squirrel-install and
            // --squirrel-updated handlers

            // Remove desktop and start menu shortcuts
            spawnUpdate(['--removeShortcut', exeName]);

            setTimeout(application.quit, 1000);
            return true;

        case '--squirrel-obsolete':
            // This is called on the outgoing version of your app before
            // we update to the new version - it's the opposite of
            // --squirrel-updated

            application.quit();
            return true;
    }
};

