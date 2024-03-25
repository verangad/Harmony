import express from 'express'
import { createServer } from 'http'
import { Server } from "socket.io";
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';

import * as fb from './firebaseutil.js'
import * as crypto from './encrypt.js'

import {initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getDatabase} from "firebase/database";
import {Stave, StaveNote} from "vexflow";

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
// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const serve = express();

const server = createServer(serve);
const io = new Server(server);

let tempStore = []

serve.use(express.json());

// For parsing application/x-www-form-urlencoded
serve.use(express.urlencoded({ extended: true }));

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.emit('initialize', "HI THIS IS FROM THE SERVER")

    // Receive change in a score
    socket.on('scoreChange', (msg) => {
        socket.broadcast.emit('scoreChangeBroadcast', msg);
    });
});

serve.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html')
    res.sendFile(join(__dirname, './collaborator/dist/index.html'));
});

serve.get('/assets/index.js', (req, res) => {
    res.setHeader('Content-Type', 'text/javascript')
    res.sendFile(join(__dirname, './collaborator/dist/assets/index.js'));
});

serve.get('/assets/index2.js', (req, res) => {
    res.setHeader('Content-Type', 'text/javascript')
    res.sendFile(join(__dirname, './collaborator/dist/assets/index2.js'));
});


serve.get('/assets/index.css', (req, res) => {
    res.setHeader('Content-Type', 'text/css')
    res.sendFile(join(__dirname, './collaborator/dist/assets/index.css'));
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

serve.get('/assets/Home.css', (req, res) => {
    res.setHeader('Content-Type', 'text/css')
    res.sendFile(join(__dirname, './collaborator/dist/assets/Home.css'));
});

serve.get('/assets/vinyl.png', (req, res) => {
    res.setHeader('Content-Type', 'text/javascript')
    res.sendFile(join(__dirname, './collaborator/dist/assets/vinyl.png'));
});

serve.get('/assets/ScoreEditor.js', (req, res) => {
    res.setHeader('Content-Type', 'text/javascript')
    res.sendFile(join(__dirname, './collaborator/dist/assets/ScoreEditor.js'));
});

serve.get('/assets/ScoreEditor.css', (req, res) => {
    res.setHeader('Content-Type', 'text/css')
    res.sendFile(join(__dirname, './collaborator/dist/assets/ScoreEditor.css'));
});

serve.get('/assets/Create.js', (req, res) => {
    res.setHeader('Content-Type', 'text/javascript')
    res.sendFile(join(__dirname, './collaborator/dist/assets/Create.js'));
});

serve.get('/assets/Create.css', (req, res) => {
    res.setHeader('Content-Type', 'text/css')
    res.sendFile(join(__dirname, './collaborator/dist/assets/Create.css'));
});

serve.get('/assets/store.js', (req, res) => {
    res.setHeader('Content-Type', 'text/javascript')
    res.sendFile(join(__dirname, './collaborator/dist/assets/store.js'));
});



serve.get('/assets/axios.js', (req, res) => {
    res.setHeader('Content-Type', 'text/javascript')
    res.sendFile(join(__dirname, './collaborator/dist/assets/axios.js'));
});

serve.get('/canvas.html', (req, res) => {
    res.setHeader('Content-Type', 'text/html')
    res.sendFile(join(__dirname, 'canvas.html'));
});

serve.get('/test.js', (req, res) => {
    res.setHeader('Content-Type', 'text/javascript')
    res.sendFile(join(__dirname, 'test.js'));
});

serve.get('/canvas.js', (req, res) => {
    res.setHeader('Content-Type', 'text/javascript')
    res.sendFile(join(__dirname, 'canvas.js'));
});

serve.get('/styles.css', (req, res) => {
    res.setHeader('Content-Type', 'text/css')
    res.sendFile(join(__dirname, 'Styles/styles.css'));
});

serve.get('/querySheet.css', (req, res) => {
    res.setHeader('Content-Type', 'text/css')
    res.sendFile(join(__dirname, 'Styles/querySheet.css'));
});



serve.get('/%E2%80%9Dhttps://cdnjs.cloudflare.com/ajax/libs/fabric.js/4.0.0/fabric.min.js%22', (req, res) => {
    res.setHeader('Content-Type', 'text/javascript')
    const url = "https://cdnjs.cloudflare.com/ajax/libs/fabric.js/4.0.0/fabric.min.js"
    fetch(url)
        .then( r => r.text() )
        .then( (t) => {
            res.write(t)
            res.end()
        })
});

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

serve.post('/login', async function(req, res) {
    console.log({requestBody: req.body})
    let userFound = await fb.getUser(db, req.body.acc_name)
    console.log("MADE IT")
    if (userFound !== null) {
        if(crypto.decrypt(userFound.password, userFound.salt) === req.body.acc_pass) {

            res.write(req.body.acc_name)
            res.end()
        }
        else{
            res.status(401)
            res.end()
        }
    }
    else {
        res.status(401)
        res.end()
    }
});

serve.post('/createScore', async function(req, res) {
    let pass = crypto.generatePassword()
    let simplifiedStaves = []
    let notes = []
    let simplifiedStave = {"clef": "treble", "x": 0, "y": 0, "width": 400, "timeSignature": "4/4"}

    for (let i = 0; i < 4; i++){
        notes.push({"keys": ["b/4"], "duration": "q", "noteType": "r"})
    }

    simplifiedStaves.push({"stave": simplifiedStave, "notes": notes})
    let score = JSON.stringify(simplifiedStaves)

    console.log({requestBody: req.body})
    await fb.createScore(db, req.body.user, "score", score, pass)
    console.log("Created")
    res.status(200)
    res.end()
});

serve.post('/getScores', async function(req, res) {
    console.log({requestBody: req.body})
    let scores = await fb.getScores(db, req.body.user)
    console.log("SCORES ", scores)
    res.write(JSON.stringify(scores))
    res.status(200)
    res.end()
});

serve.post('/saveScore', async function(req, res) {
    console.log({requestBody: req.body})
    await fb.saveScore(db, req.body.id, req.body.score)
    console.log("Saved")
    res.status(200)
    res.end()
});


serve.post('/create', async function (req, res) {
    console.log({requestBody: req.body})
    let userFound = await fb.getUser(db, req.body.create_name)
    if (userFound === null) {
        await fb.createUser(db, req.body.create_name, req.body.create_pass)
        console.log("Created")
        res.status(200)
        res.end()
    }
    else {
        console.log("Username taken")
        res.status(401)
        res.end()
    }
});

server.listen(9999,'localhost', () => console.log("listening"))