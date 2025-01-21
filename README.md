<h1>Harmony Collaborator</h1>

<br><br>
Deployed Website Link: https://harmony-cl18.onrender.com/ <br>
(Using OnRender's free hosting plan. May take a minute to load if it hasn't been accessed in a while)

<br>
<h2>Description</h2>

Harmony is a musical notation collaboration app that allows for composers to collaborate and create musical scores 
where changes are updated in real time. 
This app requires Node.js and was developed with Node version v20.11.1
Google Firebase is used for database communication and storage.
Socket.io is used for rooms and live collaboration.

<h2>Current Features</h2>

Create Account:
- Create Account (Unique username)
- Password AES-128 hashing

Login:
- Log in with created account
- Password AES-128 hashing
- Authentication in other pages
- Redirection to login page if not authenticated

Home:
- Create a score (Unique id)
- Created scores are given a random password initially
- See list of scores, dynamically updates

Collaboration:
- Collaborate and join a score collaboration room with the unique id and set password
- Live changes are broadcasted to all other people in the room
- Scores can have name and password changed by the score creator only

Score:
- Constant set time signature of 4/4 and set to treble clef only
- Dynamically displaying score. First stave of the row will always have clef and time signature and adapts to window size changes
- Add and remove staves
- Select a note to edit
- Supports rests and normal notes
- Supports all notes in the chromatic scale
- Supports building and inserting chords with a visualizer
- Supports natural, sharps and flats
- Supports notes in the octaves 3-6
- Supports note durations: 16th, 8th, quarter, half, whole
- Notes will be split to fit following notes and the time signature
- A note that goes past the space in the time signature will be placed in the next stave (which will be created if it does not exist)

<h2>Local Build Instructions</h2>

File Structure: 
<br>
Harmony <br>
|- collaborator <br>
|    |- dist <br>
|- server.js <br>
<br> 

To build, in the `collaborator` folder, run: <br>
`$ npm install` <br>
`$ npm run build` <br>

To start the server, in the `Harmony` folder, run: <br>
`$ npm install` <br>
`$ node server.js` <br>

You should see the text `listening` in the terminal. <br>
Now, in the browser, going to `localhost:10000` will start up the client

