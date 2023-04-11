const WebSocket = require('websocket').server;
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


const server = http.createServer(app);
server.listen(3000, () => console.log('Server listening on port 3000'));

const wsServer = new WebSocket({
    httpServer: server
});

const clients = [];

wsServer.on('request', (request) => {
    const connection = request.accept(null, request.origin);
    const clientId = clients.length;
    clients.push(connection);
    console.log(`Client ${clientId} connected`);

    connection.on('message', (message) => {
        if (message.type === 'utf8') {
            console.log(`Received message from client ${clientId}: ${message.utf8Data}`);

            // Broadcast the message to all connected clients
            clients.forEach((client) => {
                if (client !== connection) {
                    client.sendUTF(`${clientId}: ${message.utf8Data}`);
                }
            });
        }
    });
    connection.on('close', () => {
        console.log(`Client ${clientId} disconnected`);
        clients.splice(clientId, 1);
    });
});

app.post('/admin/message', (req, res) => {
    const adminMessage = req.body.message;
    if (adminMessage) {
        console.log(`Received admin message:: ${adminMessage}`);

        clients.forEach((client) => {
            client.sendUTF(adminMessage);
        });

        res.status(200).send({ status: 'success', message: 'Message sent to all clients' });
    } else {
        res.status(400).send({ status: 'error', message: 'Message is required' });
    }
});