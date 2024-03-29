import express from 'express'
import { createServer } from 'http'
import { Server } from "socket.io";
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';
import {initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore";

// Helper files
import * as fb from './firebaseutil.js'
import * as crypto from './encrypt.js'

// port 10000 is default on render
const port = 10000;

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyB_-k6khbFKGxlEBD7TiWA356FcKOikOOY",
    authDomain: "dv-collaborator.firebaseapp.com",
    projectId: "dv-collaborator",
    storageBucket: "dv-collaborator.appspot.com",
    messagingSenderId: "987162084316",
    appId: "1:987162084316:web:5d6e10fd9ab477133e4519",
    measurementId: "G-6MWR0YJBVF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// file URL
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create express server
const serve = express();
const server = createServer(serve);

// Create socket.io server
const io = new Server(server);

// For parsing json
serve.use(express.json());
// For parsing application/x-www-form-urlencoded
serve.use(express.urlencoded({ extended: true }));

// On socket.io connect
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.emit('initialize', "Connected to server")

    // Join Room event
    socket.on("joinRoom", (msg) => {

        // Join room "msg" where msg is the unique score ID
        socket.join(msg);
        console.log("Joined room", msg)

        // Receive change in a score, emit the changes to everyone else in the room
        socket.on('scoreChange', (change) => {
            socket.to(msg).emit('scoreChangeBroadcast', change);
        });
    });
});

// Get API -> HTML
serve.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html')
    res.sendFile(join(__dirname, './collaborator/dist/index.html'));
});

// Get API -> JS
serve.get('/assets/index.js', (req, res) => {
    res.setHeader('Content-Type', 'text/javascript')
    res.sendFile(join(__dirname, './collaborator/dist/assets/index.js'));
});

serve.get('/assets/index2.js', (req, res) => {
    res.setHeader('Content-Type', 'text/javascript')
    res.sendFile(join(__dirname, './collaborator/dist/assets/index2.js'));
});

serve.get('/assets/Login.js', (req, res) => {
    res.setHeader('Content-Type', 'text/javascript')
    res.sendFile(join(__dirname, './collaborator/dist/assets/Login.js'));
});

serve.get('/assets/Box.js', (req, res) => {
    res.setHeader('Content-Type', 'text/javascript')
    res.sendFile(join(__dirname, './collaborator/dist/assets/Box.js'));
});

serve.get('/assets/RowDivider.js', (req, res) => {
    res.setHeader('Content-Type', 'text/javascript')
    res.sendFile(join(__dirname, './collaborator/dist/assets/RowDivider.js'));
});

serve.get('/assets/ColumnDivider.js', (req, res) => {
    res.setHeader('Content-Type', 'text/javascript')
    res.sendFile(join(__dirname, './collaborator/dist/assets/ColumnDivider.js'));
});

serve.get('/assets/Home.js', (req, res) => {
    res.setHeader('Content-Type', 'text/javascript')
    res.sendFile(join(__dirname, './collaborator/dist/assets/Home.js'));
});

serve.get('/assets/ScoreEditor.js', (req, res) => {
    res.setHeader('Content-Type', 'text/javascript')
    res.sendFile(join(__dirname, './collaborator/dist/assets/ScoreEditor.js'));
});

serve.get('/assets/Create.js', (req, res) => {
    res.setHeader('Content-Type', 'text/javascript')
    res.sendFile(join(__dirname, './collaborator/dist/assets/Create.js'));
});

serve.get('/assets/store.js', (req, res) => {
    res.setHeader('Content-Type', 'text/javascript')
    res.sendFile(join(__dirname, './collaborator/dist/assets/store.js'));
});

serve.get('/assets/axios.js', (req, res) => {
    res.setHeader('Content-Type', 'text/javascript')
    res.sendFile(join(__dirname, './collaborator/dist/assets/axios.js'));
});

serve.get('/assets/HorizontalLine.js', (req, res) => {
    res.setHeader('Content-Type', 'text/javascript')
    res.sendFile(join(__dirname, './collaborator/dist/assets/HorizontalLine.js'));
});

// Get API -> CSS
serve.get('/assets/index.css', (req, res) => {
    res.setHeader('Content-Type', 'text/css')
    res.sendFile(join(__dirname, './collaborator/dist/assets/index.css'));
});

serve.get('/assets/Home.css', (req, res) => {
    res.setHeader('Content-Type', 'text/css')
    res.sendFile(join(__dirname, './collaborator/dist/assets/Home.css'));
});

serve.get('/assets/Create.css', (req, res) => {
    res.setHeader('Content-Type', 'text/css')
    res.sendFile(join(__dirname, './collaborator/dist/assets/Create.css'));
});

serve.get('/assets/ScoreEditor.css', (req, res) => {
    res.setHeader('Content-Type', 'text/css')
    res.sendFile(join(__dirname, './collaborator/dist/assets/ScoreEditor.css'));
});

// Get API -> Images
serve.get('/assets/full.png', (req, res) => {
    res.setHeader('Content-Type', 'image/png')
    res.sendFile(join(__dirname, './collaborator/dist/assets/full.png'));
});

serve.get('/assets/half.png', (req, res) => {
    res.setHeader('Content-Type', 'image/png')
    res.sendFile(join(__dirname, './collaborator/dist/assets/half.png'));
});

serve.get('/assets/4th.png', (req, res) => {
    res.setHeader('Content-Type', 'image/png')
    res.sendFile(join(__dirname, './collaborator/dist/assets/4th.png'));
});

serve.get('/assets/8th.png', (req, res) => {
    res.setHeader('Content-Type', 'image/png')
    res.sendFile(join(__dirname, './collaborator/dist/assets/8th.png'));
});

serve.get('/assets/16th.png', (req, res) => {
    res.setHeader('Content-Type', 'image/png')
    res.sendFile(join(__dirname, './collaborator/dist/assets/16th.png'));
});

serve.get('/assets/sharp.png', (req, res) => {
    res.setHeader('Content-Type', 'image/png')
    res.sendFile(join(__dirname, './collaborator/dist/assets/sharp.png'));
});

serve.get('/assets/flat.png', (req, res) => {
    res.setHeader('Content-Type', 'image/png')
    res.sendFile(join(__dirname, './collaborator/dist/assets/flat.png'));
});

serve.get('/assets/rest.png', (req, res) => {
    res.setHeader('Content-Type', 'image/png')
    res.sendFile(join(__dirname, './collaborator/dist/assets/rest.png'));
});

serve.get('/assets/default.png', (req, res) => {
    res.setHeader('Content-Type', 'image/png')
    res.sendFile(join(__dirname, './default.png'));
});

// Get API -> Socket.io library
serve.get('/socket.io', (req, res) => {
    res.setHeader('Content-Type', 'text/javascript')
    const url = "https://cdn.socket.io/4.7.4/socket.io.min.js"
    fetch(url)
        .then( r => r.text() )
        .then( (t) => {
            res.write(t)
            res.end()
        })
});


// Post API -> Login request
serve.post('/login', async function(req, res) {
    console.log({requestBody: req.body})

    // If login is not "" -> "" is not accepted by firebase
    if(req.body.acc_name != ""){

        // Get user with name 'acc_name' from database
        let userFound = await fb.getUser(db, req.body.acc_name)

        // If user exists and the password matches the decrypted password in the database, send a 200 and the acc_name to authenticate
        if (userFound !== null) {
            if(crypto.decrypt(userFound.password, userFound.salt) === req.body.acc_pass) {
                res.write(req.body.acc_name)
                res.end()
            }
            else {
                // Password does not match, code 401
                res.status(401)
                res.end()
            }
        }
        else {
            // Username does not exist, code 401
            res.status(401)
            res.end()
        }
    }
    else {
        // Gave invalid username, code 401
        res.status(401)
        res.end()
    }
});


// Post API -> Create Score Request
serve.post('/createScore', async function(req, res) {
    console.log({requestBody: req.body})


    // Generate new score details: password, staves, notes
    let pass = crypto.generatePassword()
    let simplifiedStave = {"clef": "treble", "x": 0, "y": 0, "width": 400, "timeSignature": "4/4"}
    let simplifiedStaves = []
    let notes = []

    for (let i = 0; i < 4; i++){
        notes.push({"keys": ["b/4"], "duration": "q", "noteType": "r"})
    }

    simplifiedStaves.push({"stave": simplifiedStave, "notes": notes})
    let score = JSON.stringify(simplifiedStaves)

    // Create a score in the database
    await fb.createScore(db, req.body.user, "score", score, pass)

    // Respond with a 200
    res.status(200)
    res.end()
});


// Post API -> Get Score Request from given username
serve.post('/getScores', async function(req, res) {
    console.log({requestBody: req.body})

    // Get scores belonging to the given user
    let scores = await fb.getScores(db, req.body.user)

    // Write and return these scores as objects
    res.write(JSON.stringify(scores))
    res.status(200)
    res.end()
});


// Post API -> Save given modified Score to database
serve.post('/saveScore', async function(req, res) {
    console.log({requestBody: req.body})

    // Write new score data to the score with given score ID
    await fb.saveScore(db, req.body.id, req.body.score)

    // Respond with a 200
    res.status(200)
    res.end()
});


// Post API -> Save given modified Score Image to database
serve.post('/saveScoreImage', async function(req, res) {
    console.log({requestBody: req.body})

    // Write new score image to the score with given score ID
    await fb.saveImage(db, req.body.id, req.body.image)

    // Respond with a 200
    res.status(200)
    res.end()
});


// Post API -> Change the name of a score given its ID
serve.post('/changeName', async function(req, res) {
    console.log({requestBody: req.body})

    // If name and id is not '' -> firebase does not accept ''
    if(req.body.room_id !== '' && req.body.room_name !== '') {
        // Change name of score
        await fb.changeName(db, req.body.room_id, req.body.room_name)

        // Respond with a 200
        res.status(200)
        res.end()
    }
    else {
        // Invalid ID or name given
        res.status(401)
        res.end()
    }
});


// Post API -> Change the password of a score given its ID
serve.post('/changePass', async function(req, res) {
    console.log({requestBody: req.body})

    // If password and id is not '' -> firebase does not accept ''
    if(req.body.room_id !== '' && req.body.room_pass !== '') {
        // Change password of score
        await fb.changePass(db, req.body.room_id, req.body.room_pass)

        // Respond with a 200
        res.status(200)
        res.end()
    }
    else {
        // Invalid ID or pass given
        res.status(401)
        res.end()
    }
});


// Post API -> Request to collaborate on a score
serve.post('/joinScore', async function(req, res) {
    console.log({requestBody: req.body})

    let scoreFound = null
    if(req.body.room_name !== '' && req.body.room_pass !== ''){
        scoreFound = await fb.findScore(db, req.body.room_name, req.body.room_pass)

        // If score is found and passes authentication
        if (scoreFound !== null) {
            // Write the score and send back to requester
            res.write(JSON.stringify(scoreFound))
            res.end()
        }
        else {
            // Score not found, return 401
            res.status(401)
            res.end()
        }
    }
    else {
        // Invalid score name and password given, return 401
        res.status(401)
        res.end()
    }
});


// Post API -> Request to create a new account given an account name and password
serve.post('/create', async function (req, res) {
    console.log({requestBody: req.body})

    // Attempt to get a user with the given name
    // If the user does not exist, we can create an account with that name
    let userFound = await fb.getUser(db, req.body.create_name)
    if (userFound === null) {
        // Create account
        await fb.createUser(db, req.body.create_name, req.body.create_pass)

        // Send 200
        console.log("Created")
        res.status(200)
        res.end()
    }
    else {
        // Username Taken, send 401
        console.log("Username taken")
        res.status(401)
        res.end()
    }
});

// Server listening on port 10000
server.listen(port, () => console.log("listening"))