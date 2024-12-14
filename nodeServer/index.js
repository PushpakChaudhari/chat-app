// const io = require('socket.io')(8000, {
//     cors: {
//         origin: "http://localhost:5174", // Replace with your front-end's origin
//         methods: ["GET", "POST"],
//         credentials: true
//     }
// });

// const users = {};

// io.on('connection', socket => {
//     // Event: New User Joined
//     // socket.on('new-user-joined', name => {
//     //     users[socket.id] = name;
//     //     console.log(name);
       
        
//     //     socket.broadcast.emit('user-joined', name);
//     // });
//     socket.on('new-user-joined', (username) => {
//         users[username] = socket.id; // Map username to socket ID
//         socket.username = username; // Store username in socket for later use
//         console.log(`User joined: ${username} (${socket.id})`);
//         console.log('Updated Users Map:', users);
    
//         io.emit('user-joined', username); // Notify all clients
//       });

//     // Event: Message Sent
//     socket.on('send', message => {
//         socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
//     });
//     socket.on('typing', (userName) => {
//         socket.broadcast.emit('typing', userName);
//       });
    
//       socket.on('stop-typing', () => {
//         socket.broadcast.emit('stop-typing');
//       });

//     socket.on('get-users', (callback) => {
//         callback(Object.values(users));
//       });
//     // Event: User Disconnects
//     socket.on('disconnect', () => {
//         if (users[socket.id]) {
//             socket.broadcast.emit('user-left', users[socket.id]);
//             delete users[socket.id];
//         }
//     });


//     socket.on('private-message', ({ message, to }) => {
//         const recipientSocketId = users[to];
//         console.log(`Private message: ${message}, To: ${to}`);
//         console.log('Recipient username:', to);
//         console.log('Recipient socket ID:', recipientSocketId);
//         console.log('Users Map:', users);
    
//         if (recipientSocketId) {
//           io.to(recipientSocketId).emit('receive', {
//             name: socket.username, // Sender's username
//             message,
//           });
//         } else {
//           socket.emit('error', 'Recipient not found');
//         }
//       });
      
// });



const io = require('socket.io')(8000, {
    cors: {
        origin: "https://chat-app-steel-eight.vercel.app", // Replace with your front-end's origin
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Users object: Maps usernames to their respective socket IDs
const users = {};

io.on('connection', (socket) => {
    console.log(`A user connected: ${socket.id}`);

    // Event: New User Joined
    socket.on('new-user-joined', (username) => {
        if (username) {
            users[username] = socket.id; // Map username to socket ID
            socket.username = username; // Store username in socket for later use
            console.log(`User joined: ${username} (${socket.id})`);
            console.log('Updated Users Map:', users);

            io.emit('user-joined', username); // Notify all clients
        } else {
            console.log('Error: Username is required for joining');
        }
    });

    // Event: Broadcast Public Message
    socket.on('send', (message) => {
        if (message.trim()) {
            console.log(`Public message from ${socket.username || "Unknown"}: ${message}`);
            socket.broadcast.emit('receive', { message, name: socket.username || 'Anonymous' });
        }
    });

    // Event: Private Message
    socket.on('private-message', ({ message, to }) => {
        const recipientSocketId = users[to];
        console.log(`Private message: ${message}, To: ${to}`);
        console.log('Recipient username:', to);
        console.log('Recipient socket ID:', recipientSocketId);
        console.log('Users Map:', users);

        if (recipientSocketId) {
            io.to(recipientSocketId).emit('receive', {
                name: socket.username || 'Anonymous', // Sender's username
                message,
            });
        } else {
            console.log(`Recipient not found: ${to}`);
            socket.emit('error', `Recipient '${to}' not found`);
        }
    });

    // Event: Typing Notification
    socket.on('typing', (username) => {
        console.log(`${username} is typing...`);
        socket.broadcast.emit('typing', username);
    });

    socket.on('stop-typing', () => {
        console.log(`${socket.username || "Unknown"} stopped typing`);
        socket.broadcast.emit('stop-typing');
    });

    // Event: Get List of Online Users
    socket.on('get-users', (callback) => {
        callback(Object.keys(users)); // Return a list of online usernames
    });

    // Event: User Disconnects
    socket.on('disconnect', () => {
        if (socket.username) {
            console.log(`${socket.username} (${socket.id}) disconnected`);
            delete users[socket.username]; // Remove user from map
            console.log('Updated Users Map:', users);

            // Notify other clients
            socket.broadcast.emit('user-left', socket.username);
        } else {
            console.log(`An unidentified user (${socket.id}) disconnected`);
        }
    });
});

