const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());

app.get('/', (req, res) => {
    res.send('Hey there pal!');
});

let joinedPlayers = {};

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0;
        var v = (c === 'x') ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

app.get('/getActivePlayers', (req, res) => {
    if (Object.keys(joinedPlayers).length === 0) {
        res.json({ message: 'No players have joined yet.' });
    } else {
        res.json(joinedPlayers);
    }
});

app.get('/join', (req, res) => {
    const { username, uuid } = req.query;

    let responseData;

    if (!uuid) {
        const newUserID = generateUUID();
        joinedPlayers[newUserID] = username || "No username.";
        responseData = {
            message: 'Player Joined',
            username: username || "No username.",
            uuid: newUserID
        };
    } else {
        if (joinedPlayers[uuid]) {
            responseData = {
                message: 'Welcome back!',
                username: joinedPlayers[uuid],
                uuid: uuid
            };
        } else {
            joinedPlayers[uuid] = username || "No username.";
            responseData = {
                message: 'New player joined!',
                username: username || "No username.",
                uuid: uuid
            };
        }
    }

    res.json(responseData);
});

app.get('/leave', (req, res) => {
    const player = req.query.player;

    if (player && Object.values(joinedPlayers).includes(player)) {
        // Remove the player by matching the username
        for (const [uuid, username] of Object.entries(joinedPlayers)) {
            if (username === player) {
                delete joinedPlayers[uuid]; // Remove the player from the object
                break;
            }
        }
        res.json({ message: `${player} has left.`, joinedPlayers });
    } else {
        res.status(400).json({ message: 'Player not found or not specified.' });
    }
});

app.listen(3000, () => {
    console.log('Running on http://localhost:3000');
});
