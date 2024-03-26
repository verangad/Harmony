<script>
import { Renderer, Stave, Formatter, StaveNote } from 'vexflow';
import ScoreEditorBar from '../components/ScoreEditorBar.vue'
import RowDivider from '@/components/RowDivider.vue';
import Sidebar from "../components/Sidebar.vue";
import { socket, state } from "@/socket";
import { rehydrateStaves, simplifyStaves } from "@/scripts/staveParser.js";
import { createStave } from "@/scripts/scoreEditor.js";
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
      visualizerGroup: null
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
      axios.post("/saveScore", {"id": this.id, "score": simplifiedScore}, {
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
    },
    moveRight() {
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
    },
    editNote(chord) {
      this.context.svg.removeChild(this.group)

      let editingStave = this.position.stave
      let editingNote = this.position.note


      let key = this.currNote.concat("/", this.currOctave)
      let keyArr = []
      let dur = this.currDuration
      if(chord){
        dur = this.chordDuration
        keyArr = this.visualizerNotes
      }
      else{
        keyArr = [key]
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
        this.staves[editingStave].notes[editingNote] = new StaveNote({ keys: keyArr, duration: dur })
      }
      // If new note is smaller than the selected, split it up
      else if (selectedNoteDuration > newNoteDuration) {

        // Insert first note
        let remainder = selectedNoteDuration - newNoteDuration
        let index = editingNote + 1

        let insertRest = dur

        if(this.currType === "n"){
          insertRest = dur.concat("r")
        }

        this.staves[editingStave].notes[editingNote] = new StaveNote({ keys: [key], duration: dur })

        // Insert same of first note as rests until there is no room
        for(remainder; remainder > 0; remainder -= newNoteDuration){
          this.staves[editingStave].notes.splice(index, 0, new StaveNote({ keys: [key], duration: insertRest }))
          index++
        }

      }
      // If new note is bigger than the selected, replace the notes that take up the space
      else if (selectedNoteDuration < newNoteDuration) {
        // Insert first note
        let remainder = newNoteDuration
        let br = editingNote >= this.staves[editingStave].notes.length - 1
        let total = 0

        while(remainder > 0 && !br){
          let minus = this.staves[editingStave].notes[editingNote].duration

          if(minus === "q"){
            minus = 1.0/4.0
          }
          else {
            minus =  1.0/Number(minus)
          }
          br = editingNote >= this.staves[editingStave].notes.length - 1


          remainder -= minus
          total += minus

          this.staves[editingStave].notes.splice(editingNote, 1)
        }



        if(editingNote >= this.staves[editingStave].notes.length - 1 && remainder > 0){
          // If last stave, create new and insert remainder
          if(this.staves.length <= editingStave + 1){
            if(this.stavePos.x + 400 > this.div.offsetWidth) {
              this.stavePos.x = 0
              this.stavePos.y += 100
            }

            this.staves.push(createStave("treble", "4/4", 0, false, this.stavePos.x, this.stavePos.y))
            this.stavePos.x += 400
          }
          // If not last stave
          else {
            console.log("SD")
          }
        }
        else{
          this.staves[editingStave].notes.splice(editingNote, 0, new StaveNote({ keys: [key], duration: (1.0/total).toString() }))
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
      this.drawScore()
    },
    drawVisualizer(initial){
      if(!initial){
        this.visualizerContext.svg.removeChild(this.visualizerGroup)
      }
      this.visualizerGroup = this.visualizerContext.openGroup();

      this.visualizerRenderer.resize(this.visualizer.offsetWidth, this.visualizer.offsetHeight);
      let visualizerStave = new Stave(0,0,200)
      visualizerStave.addClef("treble")
      visualizerStave.addTimeSignature("4/4")

      let chordNotes = [new StaveNote({keys: ["b/4"], duration: "1r"})]
      if(this.visualizerNotes.length > 0){
        chordNotes = [new StaveNote({keys: this.visualizerNotes, duration: this.chordDuration})]
      }

        // Draw notes
      console.log(visualizerStave)

      visualizerStave.setContext(this.visualizerContext).draw()
      Formatter.FormatAndDraw(this.visualizerContext, visualizerStave, chordNotes);
      this.visualizerContext.closeGroup();

      },
      addNoteToChord() {
        let note = this.chordNote.concat("/", this.chordOctave)
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
        <button class="stave_button" @click="addStave">
          +
        </button>
        <button class="stave_button" @click="deleteStave">
          -
        </button>
      </template>

      <template #note_type>
        <button class="letter_button" @click="this.currDuration = 'n'">
          <img class="duration_button" src="../assets/4th.png" alt="Normal" />
        </button>
        <button class="letter_button" @click="this.currDuration = 'r'">
          <img class="duration_button" src="../assets/rest.png" alt="Rest" />
        </button>
      </template>

      <template #durations>
        <button class="letter_button" @click="this.currDuration = '16'">
          <img class="duration_button" src="../assets/16th.png" alt="Sixteenth"/>
        </button>
        <button class="letter_button" @click="this.currDuration = '8'">
          <img class="duration_button" src="../assets/8th.png" alt="Eighth" />
        </button>
        <button class="letter_button" @click="this.currDuration = '4'">
          <img class="duration_button" src="../assets/4th.png" alt="Quarter" />
        </button>
        <button class="letter_button" @click="this.currDuration = '2'">
          <img class="duration_button" src="../assets/half.png" alt="Half" />
        </button>
        <button class="letter_button" @click="this.currDuration = '1'">
          <img class="duration_button" src="../assets/full.png" alt="Full"  />
        </button>
      </template>

      <template #octave>
        <button class="letter_button" @click="this.currOctave = '3'">
          3
        </button>
        <button class="letter_button" @click="this.currOctave = '4'">
          4
        </button>
        <button class="letter_button" @click="this.currOctave = '5'">
          5
        </button>
        <button class="letter_button" @click="this.currOctave = '6'">
          6
        </button>
      </template>

      <template #note>
        <button class="letter_button" @click="this.currNote = 'c'">
          C
        </button>
        <button class="letter_button" @click="this.currNote = 'd'">
          D
        </button>
        <button class="letter_button" @click="this.currNote = 'e'">
          E
        </button>
        <button class="letter_button" @click="this.currNote = 'f'">
          F
        </button>
        <button class="letter_button" @click="this.currNote = 'g'">
          G
        </button>
        <button class="letter_button" @click="this.currNote = 'a'">
          A
        </button>
        <button class="letter_button" @click="this.currNote = 'b'">
          B
        </button>
      </template>

      <template #accidental>
        <button class="letter_button" @click="">
          <img class="duration_button" src="../assets/Sharp.png" alt="Sharp" />
        </button>
        <button class="letter_button" @click="">
          <img class="duration_button" src="../assets/Flat.png" alt="Flat" />
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
          <button class="letter_button" @click="this.chordNote = 'c'">
            C
          </button>
          <button class="letter_button" @click="this.chordNote = 'd'">
            D
          </button>
          <button class="letter_button" @click="this.chordNote = 'e'">
            E
          </button>
          <button class="letter_button" @click="this.chordNote = 'f'">
            F
          </button>
          <button class="letter_button" @click="this.chordNote = 'g'">
            G
          </button>
          <button class="letter_button" @click="this.chordNote = 'a'">
            A
          </button>
          <button class="letter_button" @click="this.chordNote = 'b'">
            B
          </button>
        </template>
        <template #chordDuration>
          <button class="letter_button" @click="changeChordDuration('16')">
            <img class="duration_button" src="../assets/16th.png" alt="Sixteenth"/>
          </button>
          <button class="letter_button" @click="changeChordDuration('8')">
            <img class="duration_button" src="../assets/8th.png" alt="Eighth" />
          </button>
          <button class="letter_button" @click="changeChordDuration('4')">
            <img class="duration_button" src="../assets/4th.png" alt="Quarter" />
          </button>
          <button class="letter_button" @click="changeChordDuration('2')">
            <img class="duration_button" src="../assets/half.png" alt="Half" />
          </button>
          <button class="letter_button" @click="changeChordDuration('1')">
            <img class="duration_button" src="../assets/full.png" alt="Full"  />
          </button>
        </template>



        <template #chordOctave>
          <button class="letter_button" @click="this.chordOctave = '3'">
            3
          </button>
          <button class="letter_button" @click="this.chordOctave = '4'">
            4
          </button>
          <button class="letter_button" @click="this.chordOctave = '5'">
            5
          </button>
          <button class="letter_button" @click="this.chordOctave = '6'">
            6
          </button>
        </template>
        <template #chordAccidental>
          <button class="letter_button" @click="">
            <img class="duration_button" src="../assets/Sharp.png" alt="Sharp" />
          </button>
          <button class="letter_button" @click="">
            <img class="duration_button" src="../assets/Flat.png" alt="Flat" />
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

.letter_button {
  width: 55px;
  height: 50px;
  border: 1px solid var(--background_color);
  background-color: var(--nav_color);
  color: white;
  transition: 0.2s;
  font-size:20px;
}
.edit_button {
  width: 105px;
}
.letter_button:hover {
  background-color: var(--nav_color_hover);
}

.duration_button {
  margin-top: 2px;
  width: 40px;
  height: 40px;
  filter: invert();
}

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