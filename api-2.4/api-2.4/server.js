// Imports

const express = require('express');
const app = express();
const server = require('http').Server(app);
const compression = require('compression');
const minify = require('express-minify');
var ss = require('socket.io-stream');

// File imports

const config = require('./config.js');

// Express middlewares

app.use(compression());
app.use(minify());
//app.use(express.static('public'));
app.use('/', express.static('build'))

// API Routes

app.get('*', function (req, res) { // The 404 Route (ALWAYS Keep this as the last route)
    res.redirect(config.webserver.splash);
});

const io = require('socket.io')(server, {maxHttpBufferSize: config.api.maxSize});

// SocketIO

const rooms = {}

io.on('connection', (socket) => {
    socket.on('chat event', (data) => {
        // Listens for chat messages from clients
        if (typeof data === 'object') {
            // Make sure the data received is a JS object
            var now = new Date();
            if (data.roomName === undefined || data.user_name === undefined || data.message === undefined || data.hmac === undefined) {
                // Check if the fields are present
                console.log(`${now} - Event had invalid fields.`)
                return;
            }
            
            io.to(data.roomName).emit('chat response', {
                // Broadcasts the message to the Socket room
                user_name: data.user_name,
                message: data.message,
                hmac: data.hmac
            });
            return;
        }
        console.log(`${now} - Event was rejected: ${data}`)
    });

    socket.on('join', (data) => {
        // Listens for join events from clients
        if (typeof data === 'object') {
            // Make sure the data received is a JS object
            var now = new Date();
            if (data.roomName === undefined || data.user_name === undefined) {
                // Make sure the data received is a JS object
                console.log(`${now} - Event had invalid fields.`)
                return;
            }
            // Join the socket to the requested room
            socket.join(data.roomName);
            io.to(data.roomName).emit('join response', {
                // Broadcasts the username as a join response to the Socket room
                user_name: data.user_name
            });

            // Update the in-mem user count
            const userCount = rooms[data.roomName];

            if (userCount === undefined) {
                // If the user count doesn't exist
                // set it to 1
                rooms[data.roomName] = 1;
                io.to(data.roomName).emit('user count', {
                    count: 1
                });
            } else {
                // Otherwise, add 1 to it
                rooms[data.roomName] = userCount + 1;
                io.to(data.roomName).emit('user count', {
                    count: userCount + 1
                });
            }

            return;
        }
        console.log(`${now} - Event was rejected: ${data}`)
    });

    socket.on('leave', (data) => {
        // Listens for leave events from clients
        socket.disconnect();
        if (typeof data === 'object') {
            // Make sure the data received is a JS object
            var now = new Date();
            if (data.roomName === null || data.user_name === undefined) {
                // Make sure the data received is a JS object
                console.log(`${now} - Event had invalid fields.`)
                return;
            }
            // Leave the socket from the requested room
            socket.leave(data.roomName)
            io.to(data.roomName).emit('leave response', {
                // Broadcasts the username as a leave response to the Socket room
                user_name: data.user_name
            });

            // Update the in-mem user count
            const userCount = rooms[data.roomName];

            if (userCount === undefined) {
                // If the user count doesn't exist
                // do nothing
                return;
            } else if (userCount === 1) {
                // If the user is the only one in the room, set the count to 0
                rooms[data.roomName] = 0;
                return;
            } else {
                // Otherwise, remove 1 from it
                rooms[data.roomName] = userCount - 1;
                io.to(data.roomName).emit('user count', {
                    count: userCount - 1
                });
            }

            return;
        }
        console.log(`${now} - Event was rejected: ${data}`)
    });

    ss(socket).on('file event', function(stream, data) {
        // Listens for file uploads
        var now = new Date();

        console.log(`${now} - File event received`)
        if (data.user_name === undefined || data.name === undefined || data.type === undefined || data.data === undefined || data.hmac === undefined) {
            console.log(`${now} - Event had invalid fields.`);
            return;
        }
        
        io.to(data.roomName).emit('file response', {
            user_name: data.user_name,
            name: data.name,
            type: data.type,
            data: data.data,
            hmac: data.hmac
        });
        
        io.to(socket.id).emit('file progress', {
            finished: true
        });
    });
    
});

// Server start

server.listen(config.webserver.port, config.webserver.host, () => {
    console.log('listening on *:' + config.webserver.port);
});
