const fs = require('fs');

const { app, BrowserWindow, shell} = require('electron')
const exec = require('child_process').exec;


const path = require('path')
const url = require('url')
const { initServer } = require('./server')

let mainWindow
const processName = 'Contacts'
const processDirectory = '/Applications/Contacts.app'

function ready() {
    createWindow();
}

function isInstalled (callback) {
    fs.exists(processDirectory, (exists) => {
        callback(exists);
    })
}

function isRunning (callback) {
    exec(`ps ax | pgrep -i "${processName}"`, (error, stdout, stderr) => {
            if (stdout) {
                callback(true);
            } else {
                callback(false);
            }
        });
}

function setupListener() {
    console.log('Recieved')

    isInstalled((installed) => {
        console.log('process installed', installed);
        if(installed) {
            isRunning((running) => {
                console.log('process running', running);
                if(!running) shell.openItem(processDirectory)
            })
        }
    })

    
    app.on('open-url', (event, url) => {
        event.preventDefault();
        console.log('Starting Server');
        console.log('event, url: ', event, ',', url);
        url.includes('startserver') && initServer(createWindow);
    })
}

function createWindow (show = false) {
    if (mainWindow) return mainWindow.show() && mainWindow.focus(); 
    mainWindow = new BrowserWindow({
        width: 800,
        heigh: 600,
        show,
    })

    mainWindow.focus();

    mainWindow.webContents.openDevTools()

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))


    mainWindow.on('closed', function () {
        mainWindow = null
    })
}

app.on('ready', ready)

app.on('will-finish-launching', setupListener)

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        // app.quit()
    }
})

app.on ('activate', function () {
    console.log('activate');
        createWindow()
})

