const express = require('express')
const { BrowserWindow, dialog } = require('electron')

const server = require('http').createServer(express())
const io = require('socket.io')(server)
var port = process.env.PORT || 8086;

let window = null;

io.on('connection', function (client) {
    console.log(client);
    client.emit('news', 'hello world')
    client.on('json', function (data) {
        window(true);
        client.emit('end');
        console.log(data);
            setTimeout(() => {
                console.log('closing socket')
                server.close(function() {
                    console.log('closed')
                })
                
            }, 3000);
    })
})

const initServer = (createWindow) => {
    window = createWindow;
    server.listen(port, function () {
        console.log('[server] listening at port %d', port);
    });
}


module.exports = {
    initServer
}
