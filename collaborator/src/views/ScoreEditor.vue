<script>
import { Renderer, Stave, Formatter, StaveNote, Accidental } from 'vexflow';
import ScoreEditorBar from '../components/ScoreEditorBar.vue'
import RowDivider from '@/components/RowDivider.vue';
import Sidebar from "../components/Sidebar.vue";
import { socket } from "@/socket";
import { rehydrateStaves, simplifyStaves, createStave } from "@/scripts/staveParser.js";
import ColumnDivider from "../components/ColumnDivider.vue";
import { store } from '../store.js'
import axios from "axios";
import SideScroller from '@/components/SideScroller.vue';
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
      position: {"stave": 0, "note": 0},
      stavePos: {"x": 0, "y": 0},
      context: null,
      group: null,
      staves: [],
      socket: null,
      renderer: null,
      div: null,
      currDuration: "4",
      currNote: "b",
      currType: "n",
      currOctave: "4",
      chordDuration: "1",
      chordNote: "b",
      chordOctave: "4",
      id: null,
      visualizer: null,
      visualizerRenderer: null,
      visualizerContext: null,
      visualizerNotes: ["c/4", "e/4", "g/4"],
      visualizerGroup: null,
      accidental: "",
      chordAccidental: ""

      }
  },
  created() {
    window.addEventListener("resize", this.resize);
  },
  destroyed() {
    window.removeEventListener("resize", this.resize);
  },
  methods: {
    goBack() {
      html2canvas(this.div).then((canvas)=> {
        let dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        console.log(dataUrl);

        axios.post("/saveScoreImage", {"id": this.id, "image": dataUrl}, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
            .then((resp) => {
              console.log("Saved!", resp)
            })
            .catch((error) => {
              console.log(error);
            })
      });
      this.$router.push('/home')
    },
    saveSheet() {
      let simplifiedScore = JSON.stringify(simplifyStaves(this.staves))
      axios.post("/saveScore", {"id": this.id, "score": simplifiedScore }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
          .then((resp) => {
            console.log("Saved!", resp)
          })
          .catch((error) => {
            console.log(error);
          })
    },
    sendSheet() {
      let simplifiedStaves = simplifyStaves(this.staves)
      socket.emit('scoreChange', simplifiedStaves )
    },
    drawScore(){

      let drawX = 0
      let drawY = 0
      this.group = this.context.openGroup();

      this.renderer.resize(this.div.offsetWidth, this.div.offsetHeight);
      for(let i = 0; i < this.staves.length; i++){
        // Draw notes


        if(drawX === 0){
          this.staves[i].stave = new Stave(drawX, drawY, 400)
          this.staves[i].stave.addClef("treble")
          this.staves[i].stave.addTimeSignature("4/4")
        }
        else {
          this.staves[i].stave = new Stave(drawX, drawY, 400)
        }

        this.staves[i].stave.setContext(this.context).draw()
        Formatter.FormatAndDraw(this.context, this.staves[i].stave, this.staves[i].notes);


        if(drawX + 800 > this.div.offsetWidth) {
          drawX = 0
          drawY += 100
        }
        else{
          drawX += 400
        }

      }

      this.context.closeGroup();
    },
    resize()
    {
      this.context.svg.removeChild(this.group)
      this.drawScore()
      this.drawVisualizer()
    },
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
            this.staves.push(createStave("treble", "4/4", 0, false, this.stavePos.x, this.stavePos.y))
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
      addStave(initialStave, clef, timeSignature, level, firstInBar) {
        if(!initialStave){
          this.context.svg.removeChild(this.group)
        }


        this.staves.push(createStave(clef, timeSignature, level, firstInBar, this.stavePos.x, this.stavePos.y))
        this.staves[this.position.stave].notes[this.position.note].setStyle({fillStyle: "blue", strokeStyle: "blue"})


        this.drawScore()
        this.sendSheet()
        this.saveSheet()
      },
      deleteStave()
      {
        if(this.staves.length > 0) {
          this.context.svg.removeChild(this.group)
          this.staves.pop()

          this.drawScore()
          this.sendSheet()
          this.saveSheet()
        }

      },
      updateScore(initialStave, score) {
        this.staves = score

        if(!initialStave) {
          this.context.svg.removeChild(this.group)
          this.visualizerContext.svg.removeChild(this.visualizerGroup)
        }

        if(this.staves.length > 0){
          if(this.staves[0].notes.length > 0){
            this.staves[this.position.stave].notes[this.position.note].setStyle({fillStyle: "blue", strokeStyle: "blue"})
          }
        }
        this.drawScore()
      },
      drawVisualizer(initial){
        if(!initial){
          this.visualizerContext.svg.removeChild(this.visualizerGroup)
        }
        let accidentalNotes = []
        for(let i = 0; i < this.visualizerNotes.length; i++){

          if(this.visualizerNotes[i].charAt(1) !== "#" && this.visualizerNotes[i].charAt(1) !== "b"){
            accidentalNotes.push("")
          }
          else{
            accidentalNotes.push(this.visualizerNotes[i].charAt(1))
          }
        }
        this.visualizerGroup = this.visualizerContext.openGroup();

        this.visualizerRenderer.resize(this.visualizer.offsetWidth, this.visualizer.offsetHeight);
        let visualizerStave = new Stave(0,0,200)
        visualizerStave.addClef("treble")
        visualizerStave.addTimeSignature("4/4")

        let chordNotes = [new StaveNote({keys: ["b/4"], duration: "1r"})]
        if(this.visualizerNotes.length > 0){
          chordNotes = [new StaveNote({keys: this.visualizerNotes, duration: this.chordDuration})]

          for(let j = 0; j < accidentalNotes.length; j++){
            if(accidentalNotes[j] !== ""){
              chordNotes[0].addModifier(new Accidental(accidentalNotes[j]), j)
            }

          }
        }

        // Draw notes
        console.log(visualizerStave)

        visualizerStave.setContext(this.visualizerContext).draw()
        Formatter.FormatAndDraw(this.visualizerContext, visualizerStave, chordNotes);
        this.visualizerContext.closeGroup();

      },
      addNoteToChord() {
        let note = this.chordNote.concat(this.chordAccidental ,"/", this.chordOctave)
        if(!this.visualizerNotes.includes(note)){
          this.visualizerNotes.push(note)
          this.drawVisualizer(false)
        }

      },
      changeChordDuration(duration) {
        this.chordDuration = duration
        if(this.visualizerNotes.length > 0) {
          this.drawVisualizer(false)
        }

      },
      clearChord() {
        this.visualizerNotes = []
        this.drawVisualizer(false)
      },
      submitChord() {
        this.editNote(true)
      }
    },
    mounted(){
    socket.connect();

    this.visualizer = document.getElementById("chord_visualizer")

    this.div = document.getElementById("score_canvas")
    let renderer = new Renderer(this.div, Renderer.Backends.SVG)
    let visualizerRenderer = new Renderer(this.visualizer, Renderer.Backends.SVG)


    renderer.resize(this.div.offsetWidth, this.div.offsetHeight)
    visualizerRenderer.resize(this.visualizer.offsetWidth, this.visualizer.offsetHeight)
    this.renderer = renderer
    this.visualizerRenderer = visualizerRenderer

    this.context = renderer.getContext()
    this.visualizerContext = visualizerRenderer.getContext()

    let recScore = store.score
    this.id = recScore.id


    // Join room
    socket.emit('joinRoom', this.id);

    let dehydratedStaves = JSON.parse(recScore.score)
    this.updateScore(true, rehydrateStaves(dehydratedStaves, this.context))
    this.drawVisualizer(true)


    socket.on('scoreChangeBroadcast', (msg) => {
      let rehydratedStaves = rehydrateStaves(msg, this.context)
      this.updateScore(false, rehydratedStaves)
    })
  }
}

</script>

<template>
  <div class="score_editor_container">  
    <ScoreEditorBar>
      <template #back_button>
        <button @click="goBack">Back</button>
      </template>
      <template #left>
        <button class="stave_button" @click="moveLeft">
          <-
        </button>
      </template>
      <template #right>
        <button class="stave_button" @click="moveRight">
          ->
        </button>
      </template>
      <template #add_stave>
        <button class="stave_button" @click="addStave(false, '', '', 0, false)">
          +
        </button>
        <button class="stave_button" @click="deleteStave">
          -
        </button>
      </template>

      <template #note_type>
        <button class="option_button" @click="this.currType = 'n'">
          <img class="image_button" src="../assets/4th.png" alt="Normal" />
        </button>
        <button class="option_button" @click="this.currType = 'r'">
          <img class="image_button" src="../assets/rest.png" alt="Rest" />
        </button>
      </template>

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

      <template #edit_note>
        <button class="edit_button" @click="editNote(false)">Edit Note</button>
      </template>
    </ScoreEditorBar>
    <ColumnDivider>
      <div id="score_canvas" class="score_container">
      </div>

      <Sidebar>

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
        <template #addButton>
          <button @click="addNoteToChord">
          Add Note
          </button>
        </template>



        <template #visualizer>
          <div id="chord_visualizer" class="visualizer">
          </div>
        </template>

        
        <template #submitChord>
          <button  @click="submitChord">
            Submit
          </button>
        </template>
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


.score_container {
  background-color: white;
  width: 80vw;
  height:  calc(100vh - 70px);
  overflow-y: scroll;
}

.score_editor_container{
    display: flex;
    flex-direction: column;
}

.visualizer {
  background-color: white;
  border: 2px solid black;
  width: 210px;
  height: 115px;
}

.stave_button {
  width: 55px;
  height: 50px;
  border: 1px solid var(--background_color);
  background-color: var(--nav_color);
  color: white;
  transition: 0.2s;
  font-size:30px;
}

.stave_button:hover {

  background-color: var(--nav_color_hover);
}

</style>