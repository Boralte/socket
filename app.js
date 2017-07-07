const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')
const { initServer } = require('./server')

let mainWindow

function ready() {
    createWindow();
}

function setupListener() {
    console.log('Recieved')
    app.on('open-url', (event, url) => {
        event.preventDefault()
        console.log('Starting Server')
        console.log('event, url: ', event, ',', url)
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

