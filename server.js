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
    socket.emit('initialize', tempStore)
    console.log('a user connected');
    socket.on('draw', (obj) => {
        console.log('a user connessscted');
        tempStore.push(obj)
        socket.broadcast.emit('drawclient', obj)
    })
});

serve.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html')
    res.sendFile(join(__dirname, './collaborator/dist/index.html'));
});

serve.get('/assets/index-DjRWjLxA.js', (req, res) => {
    res.setHeader('Content-Type', 'text/javascript')
    res.sendFile(join(__dirname, './collaborator/dist/assets/index-DjRWjLxA.js'));
});

serve.get('/assets/index-BHGLi68v.css', (req, res) => {
    res.setHeader('Content-Type', 'text/css')
    res.sendFile(join(__dirname, './collaborator/dist/assets/index-BHGLi68v.css'));
});

serve.get('/assets/Login-BgqT7UkL.js', (req, res) => {
    res.setHeader('Content-Type', 'text/javascript')
    res.sendFile(join(__dirname, './collaborator/dist/assets/Login-BgqT7UkL.js'));
});

serve.get('/assets/Voice-Dff8Hvod.js', (req, res) => {
    res.setHeader('Content-Type', 'text/javascript')
    res.sendFile(join(__dirname, './collaborator/dist/assets/Voice-Dff8Hvod.js'));
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

            res.cookie('login', 'req.body.acc_name')
            res.write(crypto.decrypt(userFound.password, userFound.salt))
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

serve.post('/create', async function (req, res) {
    console.log({requestBody: req.body})
    let userFound = await fb.getUser(db, req.body.create_name)
    if (userFound === null) {
        await fb.createUser(db, req.body.create_name, req.body.create_pass)
        console.log("Created")
    }
    else {
        console.log("Username taken")
    }
});

serve.listen(9999,'localhost', () => console.log("listening"))
