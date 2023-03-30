const { app, BrowserWindow } = require('electron');
const path = require('path');
const { systemPreferences } = require('electron');

if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 600,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'electron_preload.js'),
    },
  });
  mainWindow.removeMenu();
  mainWindow.webContents.on('before-input-event', (_, input) => {
    if (input.type === 'keyDown' && input.key === 'F12') {
      mainWindow.webContents.isDevToolsOpened()
        ? mainWindow.webContents.closeDevTools()
        : mainWindow.webContents.openDevTools({ mode: 'left' });
    }
  });
  mainWindow.loadFile(path.join(__dirname, 'electron_loading.html'));
  if(systemPreferences.getMediaAccessStatus != null) {
    let mic_ok = systemPreferences.getMediaAccessStatus('microphone');
    if(mic_ok === true) {
      mainWindow.loadFile(path.join(__dirname, 'index.html'));
    } else {
      systemPreferences.askForMediaAccess('microphone').then( (result) => {
        console.log("RESULT:");
        console.log(result);
        if(result === true) {
          mainWindow.loadFile(path.join(__dirname, 'index.html'));
        } else {
          console.error("No access to microphone");
          mainWindow.loadFile(path.join(__dirname, 'electron_error.html'));
        }
       
      });
    }
  } else {
    mainWindow.loadFile(path.join(__dirname, 'index.html'));
  }


  

  // mainWindow.webContents.openDevTools();
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
