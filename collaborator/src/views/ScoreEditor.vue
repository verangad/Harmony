<script>
  import { Renderer, Stave, Formatter, StaveNote, Accidental } from 'vexflow';
  import ScoreEditorBar from '../components/ScoreEditorBar.vue'
  import RowDivider from '../components/RowDivider.vue';
  import Sidebar from "../components/Sidebar.vue";
  import { socket } from "../socket";
  import { rehydrateStaves, simplifyStaves, createStave } from "../scripts/staveParser.js";
  import ColumnDivider from "../components/ColumnDivider.vue";
  import { store } from '../store.js'
  import axios from "axios";
  import SideScroller from '../components/SideScroller.vue';
  import html2canvas from "html2canvas";

  export default {
    name: "ScoreEditor",
    components: {
      ColumnDivider,
      Sidebar,
      ScoreEditorBar,
      RowDivider,
      SideScroller
    },
    data() {
      return {
        // For moving left and right
        position: {"stave": 0, "note": 0},

        // For drawing score
        context: null,
        group: null,
        renderer: null,
        div: null,

        // For drawing chord visualizer
        visualizer: null,
        visualizerRenderer: null,
        visualizerContext: null,
        visualizerNotes: ["c/4", "e/4", "g/4"],
        visualizerGroup: null,

        // Store score info
        staves: [],
        id: null,

        // For current note selection
        currDuration: "4",
        currNote: "b",
        currType: "n",
        currOctave: "4",
        accidental: "",

        // For current chord note selection
        chordDuration: "1",
        chordNote: "b",
        chordOctave: "4",
        chordAccidental: ""
        }
    },
    created() {
      // Listen for window size changes to adjust the score
      window.addEventListener("resize", this.resize);
    },
    destroyed() {
      // Close listener
      window.removeEventListener("resize", this.resize);
    },
    methods: {
      // Go back to the home page -> need to save the snapshot of the score
      goBack() {
        // HTML2Canvas takes a snapshot of a div and returns a dataUrl string
        html2canvas(this.div).then((canvas)=> {

          // Convert to dataUrl and send a POST request with the score id and the image data to set it in the database
          let dataUrl = canvas.toDataURL('image/jpeg', 0.9);

          axios.post("/saveScoreImage", {"id": this.id, "image": dataUrl}, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          })
          .then((resp) => {
            console.log("Captured Image Data", resp)
          })
          .catch((error) => {
            console.log(error);
          })
        });

        // After saving, go back to home page
        this.$router.push('/home')
      },
      // Save the current score to the database
      saveSheet() {
        // Simplify the score to a basic object and send a POST request with the score id and the updated score string
        let simplifiedScore = JSON.stringify(simplifyStaves(this.staves))
        axios.post("/saveScore", {"id": this.id, "score": simplifiedScore }, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
        .then((resp) => {
          console.log("Saved Sheet.", resp)
        })
        .catch((error) => {
          console.log(error);
        })
      },
      // Send the current score to the socket.io server to be sent to all other users in the same room
      sendSheet() {
        let simplifiedStaves = simplifyStaves(this.staves)
        socket.emit('scoreChange', simplifiedStaves )
      },
      // Remove the old score and draw the new one
      drawScore(){

        let drawX = 0
        let drawY = 0

        // Open group -> allows us to remove a group to delete it
        this.group = this.context.openGroup();

        // Get new size of window to resize the score
        this.renderer.resize(this.div.offsetWidth, this.div.offsetHeight);

        // Refactor staves based on screen size and draw each stave
        for(let i = 0; i < this.staves.length; i++){


          // Set new staves to draw after resizing
          // If first stave, draw with a clef and time signature
          if(drawX === 0){
            this.staves[i].stave = new Stave(drawX, drawY, 400)
            this.staves[i].stave.addClef("treble")
            this.staves[i].stave.addTimeSignature("4/4")
          }
          // Else, set with a normal stave
          else {
            this.staves[i].stave = new Stave(drawX, drawY, 400)
          }

          // Draw the stave and its notes
          this.staves[i].stave.setContext(this.context).draw()
          Formatter.FormatAndDraw(this.context, this.staves[i].stave, this.staves[i].notes);

          // Shift draw to new row if reached end of div
          if(drawX + 800 > this.div.offsetWidth) {
            drawX = 0
            drawY += 100
          }
          else{
            drawX += 400
          }
        }

        // Close group and next time we can delete the whole group to redraw
        this.context.closeGroup();
      },
      // Resize window detected, redraw score and visualizer
      resize()
      {
        this.context.svg.removeChild(this.group)
        this.drawScore()
        this.drawVisualizer()
      },
      // Move the selected note left
      moveLeft() {
        if(this.staves.length > 0){
          // Dont move left when we are at the first stave and first note
          if(this.position.stave !== 0 || this.position.note !== 0) {

            // Clear previous score
            this.context.svg.removeChild(this.group)

            // Unselect Note
            this.staves[this.position.stave].notes[this.position.note].setStyle({fillStyle: "black", strokeStyle: "black"})

            // Moving to previous stave if we are at the leftmost of the current stave
            if(this.position.note === 0) {
              this.position.stave--
              this.position.note = this.staves[this.position.stave].notes.length - 1
            }
            else {
              // Move left
              this.position.note--
            }

            // Colour selected note blue
            this.staves[this.position.stave].notes[this.position.note].setStyle({fillStyle: "blue", strokeStyle: "blue"})
            this.drawScore()
          }
        }
      },
      // Move the selected note right
      moveRight() {
        if(this.staves.length > 0){
          let rightmostNotePos = this.staves[this.position.stave].notes.length - 1

          // Dont move right when we are at the last stave and last note
          if(this.position.stave !== this.staves.length - 1 || this.position.note !== rightmostNotePos) {

            // Clear previous score
            this.context.svg.removeChild(this.group)

            // Unselect Note
            this.staves[this.position.stave].notes[this.position.note].setStyle({fillStyle: "black", strokeStyle: "black"})

            // Moving to next stave if we are at the rightmost of the current stave
            if(this.position.note === rightmostNotePos) {
              this.position.stave++
              this.position.note = 0
            }
            else {
              // Move right
              this.position.note++
            }

            // Colour selected note blue
            this.staves[this.position.stave].notes[this.position.note].setStyle({fillStyle: "blue", strokeStyle: "blue"})
            this.drawScore()
          }
        }
      },
      editNote(chord) {
        this.context.svg.removeChild(this.group)

        let editingStave = this.position.stave
        let editingNote = this.position.note


        let key = this.currNote.concat(this.accidental, "/", this.currOctave)
        let keyArr = []
        let dur = this.currDuration
        if(chord){
          dur = this.chordDuration
          keyArr = this.visualizerNotes
        }
        else{
          keyArr = [key]
        }

        let accidentalNotes = []
        for(let i = 0; i < keyArr.length; i++){

          if(keyArr[i].charAt(1) !== "#" && keyArr[i].charAt(1) !== "b"){
            accidentalNotes.push("")
          }
          else{
            accidentalNotes.push(keyArr[i].charAt(1))
          }
        }


        let selectedNoteDuration = this.staves[editingStave].notes[editingNote].duration
        if(selectedNoteDuration === "q") {
          selectedNoteDuration =  1.0/4.0
        }
        else {
          selectedNoteDuration =  1.0/Number(selectedNoteDuration)
        }

        let newNoteDuration = 1.0/Number(dur)

        // Split Note

        // If note is same duration -> simply replace it
        if(selectedNoteDuration === newNoteDuration) {

          this.staves[editingStave].notes[editingNote] = new StaveNote({ keys: keyArr, duration: dur.concat(this.currType) })

        }
        // If new note is smaller than the selected, split it up
        else if (selectedNoteDuration > newNoteDuration) {

          // Insert first note
          let remainder = selectedNoteDuration - newNoteDuration
          let index = editingNote + 1

          let insertRest = dur



          this.staves[editingStave].notes[editingNote] = new StaveNote({ keys: keyArr, duration: dur.concat(this.currType) })

          // Insert same of first note as rests until there is no room
          for(remainder; remainder > 0; remainder -= newNoteDuration){
            this.staves[editingStave].notes.splice(index, 0, new StaveNote({ keys: keyArr, duration: insertRest }))
            index++
          }

        }
        // If new note is bigger than the selected, replace the notes that take up the space
        else if (selectedNoteDuration < newNoteDuration) {
          // Check if fit in stave
          let remainder = newNoteDuration;
          let newNoteDurationString = (1.0 / newNoteDuration).toString()
          let currNote = editingNote;
          let numNotes = this.staves[editingStave].notes.length - 1
          let numNotesToCut = 0;
          let breaker = 0
          let newRemainder = 0;
          let oldKeys = [];

          while(currNote <= numNotes && remainder > 0 && !breaker) {

            let checkNoteDuration = this.staves[editingStave].notes[currNote].duration

            if (checkNoteDuration === "q") {
              checkNoteDuration = 1.0 / 4.0
            } else {
              checkNoteDuration = 1.0 / Number(checkNoteDuration)
            }

            if (checkNoteDuration <= remainder && currNote <= numNotes) {
              numNotesToCut++;
              currNote++
              remainder -= checkNoteDuration
            }
            else if(checkNoteDuration > remainder && currNote <= numNotes) {
              // duration of second note
              newRemainder = checkNoteDuration - remainder;

              oldKeys = this.staves[editingStave].notes[currNote].keys
              breaker = 1
            }
          }

          // Fits in
          if(remainder === 0) {
            this.staves[editingStave].notes[editingNote] = new StaveNote({keys: keyArr, duration: newNoteDurationString.concat(this.currType)})
            for(let i = 0; i < numNotesToCut - 1; i++){
              this.staves[editingStave].notes.splice(editingNote + 1, 1)
            }
          }
          else if(remainder > 0 && currNote <= numNotes) {
            this.staves[editingStave].notes[editingNote] = new StaveNote({keys: keyArr, duration: newNoteDurationString.concat(this.currType)})
            for(let i = 0; i < numNotesToCut - 1; i++){
              this.staves[editingStave].notes.splice(editingNote + 1, 1)
            }
            let remainderString = (1.0/remainder).toString()
            let newRemainderString = (1.0/newRemainder).toString()
            this.staves[editingStave].notes.splice(editingNote + 1, 1)
            this.staves[editingStave].notes.splice(editingNote + 1, 0, new StaveNote({keys: oldKeys, duration: newRemainderString.concat(this.currType)}))


          }
          /*
          // Overflow, create new stave or move to next one
          */
          else if (remainder > 0 && currNote > numNotes) {
            //last stave, create new one
            if(this.staves.length <= editingStave + 1){
              this.staves.push(createStave("treble", "4/4", false))
            }

            // fill up to end of stave
            for(let i = 0; i < numNotesToCut; i++){
              let currDur = this.staves[editingStave].notes[editingNote].duration
              this.staves[editingStave].notes[editingNote + i] = new StaveNote({keys: keyArr, duration: currDur})
            }
            let currDur = 0
            if (this.staves[editingStave + 1].notes[0].duration === "q") {
              currDur = 1.0 / 4.0
            } else {
              currDur = 1.0 / Number(this.staves[editingStave + 1].notes[0].duration)
            }

            let counter = 0
            let newBreaker = false
            let newOldKeys = []
            let secondRemainder = 0
            while(remainder > 0 && !newBreaker) {
              console.log(remainder)
              // Fill new stave
              // Equal
              if(remainder >= currDur){
                this.staves[editingStave + 1].notes[counter] = new StaveNote({keys: keyArr, duration: this.staves[editingStave + 1].notes[0].duration})

                remainder -= currDur
                counter++
              }
              // split
              else if (remainder < currDur){
                // duration of second note
                secondRemainder = currDur - remainder;

                newOldKeys = this.staves[editingStave + 1].notes[counter].keys
                newBreaker = 1
              }
            }
            let newNoteDurationString = (1.0 / remainder).toString()
            if(remainder > 0) {
              this.staves[editingStave + 1].notes[counter] = new StaveNote({keys: keyArr, duration: newNoteDurationString})

              let secondRemainderString = (1.0/secondRemainder).toString()
              this.staves[editingStave].notes.splice(counter + 1, 1)
              this.staves[editingStave].notes.splice(counter + 1, 0, new StaveNote({keys: newOldKeys, duration: secondRemainderString}))

            }
          }
        }

        if(keyArr.length > 0){
          let acciNotes = this.staves[editingStave].notes[editingNote]
          for(let j = 0; j < accidentalNotes.length; j++){
            if(accidentalNotes[j] !== ""){
              acciNotes.addModifier(new Accidental(accidentalNotes[j]), j)
            }

          }
        }

        // Select Note

          this.staves[this.position.stave].notes[this.position.note].setStyle({fillStyle: "blue", strokeStyle: "blue"})


          this.drawScore()
          this.sendSheet()
          this.saveSheet()
        },
        // Add an empty stave to the stave list and draw it
        addStave(initialStave, clef, timeSignature, firstInBar) {

          // Delete old drawn staves if not the first draw
          if(!initialStave){
            this.context.svg.removeChild(this.group)
          }

          // Add new stave to stave list
          this.staves.push(createStave(clef, timeSignature, firstInBar))

          // Rehighlight the selected note (since we cleared the score
          this.staves[this.position.stave].notes[this.position.note].setStyle({fillStyle: "blue", strokeStyle: "blue"})

          // Draw, send to other users and save to database
          this.drawScore()
          this.sendSheet()
          this.saveSheet()
        },
        // Delete the last stave from the stave list and redraw it
        deleteStave()
        {
          // If we have a stave to delete
          if(this.staves.length > 0) {
            // Clear score and remove last stave
            this.context.svg.removeChild(this.group)
            this.staves.pop()

            // Draw, send to other users and save to database
            this.drawScore()
            this.sendSheet()
            this.saveSheet()
          }
        },
        // Update the score in the array and redraw
        updateScore(initialStave, score) {
          // Set score variable to the given score
          this.staves = score

          // If not initial draw, clear the score canvas and chord canvas
          if(!initialStave) {
            this.context.svg.removeChild(this.group)
            //this.visualizerContext.svg.removeChild(this.visualizerGroup)
          }

          // Re set selected if a note exists
          if(this.staves.length > 0){
            if(this.staves[0].notes.length > 0){
              this.staves[this.position.stave].notes[this.position.note].setStyle({fillStyle: "blue", strokeStyle: "blue"})
            }
          }
          this.drawScore()
        },

        drawVisualizer(initial){

          // If not drawing the initial stave, clear the chord visualizer
          if(!initial){
            this.visualizerContext.svg.removeChild(this.visualizerGroup)
          }

          // Insert accidentals
          let accidentalNotes = []
          for(let i = 0; i < this.visualizerNotes.length; i++){

            // Append nothing if natural accidental
            if(this.visualizerNotes[i].charAt(1) !== "#" && this.visualizerNotes[i].charAt(1) !== "b"){
              accidentalNotes.push("")
            }
            else {
              // Append accidental
              accidentalNotes.push(this.visualizerNotes[i].charAt(1))
            }
          }

          // Open group and resize visualizer before drawing
          this.visualizerGroup = this.visualizerContext.openGroup();
          this.visualizerRenderer.resize(this.visualizer.offsetWidth, this.visualizer.offsetHeight);

          // Create new stave and add clef and time signature (there is only one stave for the chord visualizer)
          let visualizerStave = new Stave(0,0,200)
          visualizerStave.addClef("treble")
          visualizerStave.addTimeSignature("4/4")

          // Insert Chord notes with accidentals
          let chordNotes = [new StaveNote({keys: ["b/4"], duration: "1r"})]
          if(this.visualizerNotes.length > 0){
            chordNotes = [new StaveNote({keys: this.visualizerNotes, duration: this.chordDuration})]

            // Add accidentals
            for(let j = 0; j < accidentalNotes.length; j++){
              if(accidentalNotes[j] !== ""){
                chordNotes[0].addModifier(new Accidental(accidentalNotes[j]), j)
              }
            }
          }

          // Draw stave and chord
          visualizerStave.setContext(this.visualizerContext).draw()
          Formatter.FormatAndDraw(this.visualizerContext, visualizerStave, chordNotes);

          // Close group for future clearing
          this.visualizerContext.closeGroup();
        },
        // Add a note to a chord and draw
        addNoteToChord() {
          // Add accidentals and octave
          let note = this.chordNote.concat(this.chordAccidental ,"/", this.chordOctave)

          // If note is not already in the chord, add note to chord and draw
          if(!this.visualizerNotes.includes(note)){
            this.visualizerNotes.push(note)
            this.drawVisualizer(false)
          }
        },
        // Change the duration of the chord and redraw
        changeChordDuration(duration) {
          this.chordDuration = duration

          // If there are notes in the chord visualizer, redraw with the new duration
          if(this.visualizerNotes.length > 0) {
            this.drawVisualizer(false)
          }
        },
        // Clear the chord visualizer and redraw
        clearChord() {
          this.visualizerNotes = []
          this.drawVisualizer(false)
        },
        // Submit chord -> insert the chord into the score at the selected position
        submitChord() {
          this.editNote(true)
        }
      },
      mounted(){

        // Socket.io connect to server
        socket.connect();

        // Get divs for the score and chord visualizer
        this.div = document.getElementById("score_canvas")
        this.visualizer = document.getElementById("chord_visualizer")

        // make Renderers for both divs
        let renderer = new Renderer(this.div, Renderer.Backends.SVG)
        let visualizerRenderer = new Renderer(this.visualizer, Renderer.Backends.SVG)

        // Resize both renderers to fit the div
        renderer.resize(this.div.offsetWidth, this.div.offsetHeight)
        visualizerRenderer.resize(this.visualizer.offsetWidth, this.visualizer.offsetHeight)

        // Set in variables for future use
        this.renderer = renderer
        this.visualizerRenderer = visualizerRenderer

        let recScore = store.score
        this.id = recScore.id

        // Get context
        this.context = renderer.getContext()
        this.visualizerContext = visualizerRenderer.getContext()

        // Join room with the unique id of this score
        socket.emit('joinRoom', this.id);

        // Update and draw initial score (rehydrated from the database) and draw the initial chord visualizer
        let dehydratedStaves = JSON.parse(recScore.score)
        this.updateScore(true, rehydrateStaves(dehydratedStaves, this.context))
        this.drawVisualizer(true)

        // Received broadcasted change from another user in the room. Update the current score with the changes
        socket.on('scoreChangeBroadcast', (msg) => {
          // Parse received staves into proper stave objects, update and redraw
          let rehydratedStaves = rehydrateStaves(msg, this.context)
          this.updateScore(false, rehydratedStaves)
        })
    }
  }
</script>

<template>
  <div class="score_editor_container">

    <!-- Navigation Top Bar --->
    <ScoreEditorBar>

      <!-- Back Button --->
      <template #back_button>
        <button @click="goBack">Back</button>
      </template>

      <!-- Move Left Button --->
      <template #left>
        <button class="dual_button" @click="moveLeft">
          <-
        </button>
      </template>
      <!-- Move Right Button --->
      <template #right>
        <button class="dual_button" @click="moveRight">
          ->
        </button>
      </template>

      <!-- Add or Remove Stave Buttons --->
      <template #add_stave>
        <button class="dual_button" @click="addStave(false, '', '', false)">
          +
        </button>
        <button class="dual_button" @click="deleteStave">
          -
        </button>
      </template>

      <!-- Normal/Rest Button --->
      <template #note_type>
        <button class="option_button" @click="this.currType = 'n'">
          <img class="image_button" src="../assets/4th.png" alt="Normal" />
        </button>
        <button class="option_button" @click="this.currType = 'r'">
          <img class="image_button" src="../assets/rest.png" alt="Rest" />
        </button>
      </template>

      <!-- Duration Button --->
      <template #durations>
        <button class="option_button" @click="this.currDuration = '16'">
          <img class="image_button" src="../assets/16th.png" alt="Sixteenth"/>
        </button>
        <button class="option_button" @click="this.currDuration = '8'">
          <img class="image_button" src="../assets/8th.png" alt="Eighth" />
        </button>
        <button class="option_button" @click="this.currDuration = '4'">
          <img class="image_button" src="../assets/4th.png" alt="Quarter" />
        </button>
        <button class="option_button" @click="this.currDuration = '2'">
          <img class="image_button" src="../assets/half.png" alt="Half" />
        </button>
        <button class="option_button" @click="this.currDuration = '1'">
          <img class="image_button" src="../assets/full.png" alt="Full"  />
        </button>
      </template>

      <!-- Change Octave Button --->
      <template #octave>
        <button class="option_button" @click="this.currOctave = '3'">
          3
        </button>
        <button class="option_button" @click="this.currOctave = '4'">
          4
        </button>
        <button class="option_button" @click="this.currOctave = '5'">
          5
        </button>
        <button class="option_button" @click="this.currOctave = '6'">
          6
        </button>
      </template>

      <!-- Change Notes Button --->
      <template #note>
        <button class="option_button" @click="this.currNote = 'c'">
          C
        </button>
        <button class="option_button" @click="this.currNote = 'd'">
          D
        </button>
        <button class="option_button" @click="this.currNote = 'e'">
          E
        </button>
        <button class="option_button" @click="this.currNote = 'f'">
          F
        </button>
        <button class="option_button" @click="this.currNote = 'g'">
          G
        </button>
        <button class="option_button" @click="this.currNote = 'a'">
          A
        </button>
        <button class="option_button" @click="this.currNote = 'b'">
          B
        </button>
      </template>

      <!-- Change Accidental Button --->
      <template #accidental>
        <button class="option_button" @click="this.accidental = ''">
          <img class="image_button" src="../assets/natural.png" alt="Natural" />
        </button>
        <button class="option_button" @click="this.accidental = '#'">
          <img class="image_button" src="../assets/sharp.png" alt="Sharp" />
        </button>
        <button class="option_button" @click="this.accidental = 'b'">
          <img class="image_button" src="../assets/flat.png" alt="Flat" />
        </button>
      </template>

      <!-- Edit Note Button --->
      <template #edit_note>
        <button class="edit_button" @click="editNote(false)">Edit Note</button>
      </template>
    </ScoreEditorBar>

    <ColumnDivider>

      <!-- Score --->
      <div id="score_canvas" class="score_container">
      </div>

      <!-- Sidebar --->
      <Sidebar>

        <!-- Change Chord Note Button --->
        <template #chordNote>
          <button class="option_button" @click="this.chordNote = 'c'">
            C
          </button>
          <button class="option_button" @click="this.chordNote = 'd'">
            D
          </button>
          <button class="option_button" @click="this.chordNote = 'e'">
            E
          </button>
          <button class="option_button" @click="this.chordNote = 'f'">
            F
          </button>
          <button class="option_button" @click="this.chordNote = 'g'">
            G
          </button>
          <button class="option_button" @click="this.chordNote = 'a'">
            A
          </button>
          <button class="option_button" @click="this.chordNote = 'b'">
            B
          </button>
        </template>

        <!-- Change Chord Duration Button --->
        <template #chordDuration>
          <button class="option_button" @click="changeChordDuration('16')">
            <img class="image_button" src="../assets/16th.png" alt="Sixteenth"/>
          </button>
          <button class="option_button" @click="changeChordDuration('8')">
            <img class="image_button" src="../assets/8th.png" alt="Eighth" />
          </button>
          <button class="option_button" @click="changeChordDuration('4')">
            <img class="image_button" src="../assets/4th.png" alt="Quarter" />
          </button>
          <button class="option_button" @click="changeChordDuration('2')">
            <img class="image_button" src="../assets/half.png" alt="Half" />
          </button>
          <button class="option_button" @click="changeChordDuration('1')">
            <img class="image_button" src="../assets/full.png" alt="Full"  />
          </button>
        </template>

        <!-- Change Chord Note Octave Button --->
        <template #chordOctave>
          <button class="option_button" @click="this.chordOctave = '3'">
            3
          </button>
          <button class="option_button" @click="this.chordOctave = '4'">
            4
          </button>
          <button class="option_button" @click="this.chordOctave = '5'">
            5
          </button>
          <button class="option_button" @click="this.chordOctave = '6'">
            6
          </button>
        </template>

        <!-- Change Chord Note Accidental Button --->
        <template #chordAccidental>
          <button class="option_button" @click="this.chordAccidental = ''">
            <img class="image_button" src="../assets/natural.png" alt="Natural" />
          </button>
          <button class="option_button" @click="this.chordAccidental = '#'">
            <img class="image_button" src="../assets/sharp.png" alt="Sharp" />
          </button>
          <button class="option_button" @click="this.chordAccidental = 'b'">
            <img class="image_button" src="../assets/flat.png" alt="Flat" />
          </button>
        </template>

        <!-- Add Note To Chord Button --->
        <template #addButton>
          <button @click="addNoteToChord">
          Add Note
          </button>
        </template>

        <!-- Chord Canvas --->
        <template #visualizer>
          <div id="chord_visualizer" class="visualizer">
          </div>
        </template>

        <!-- Add Chord To Canvas --->
        <template #submitChord>
          <button  @click="submitChord">
            Submit
          </button>
        </template>

        <!-- Clear Chord To Start a New One --->
        <template #clearChord>
          <button  @click="clearChord">
            Clear
          </button>
        </template>
        
      </Sidebar>
    </ColumnDivider>
  </div>
</template>

<style scoped>
  @import '../assets/base.css';
  @import '../assets/scrollbar.css';
  @import '../assets/buttons.css';
  @import '../assets/scoreEditor.css';
</style>