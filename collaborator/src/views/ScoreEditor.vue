<script>
import { Renderer, Stave, Formatter, StaveNote } from 'vexflow';
import ScoreEditorBar from '../components/ScoreEditorBar.vue'
import Score from "../components/Score.vue"
import RowDivider from '@/components/RowDivider.vue';
import Sidebar from "../components/Sidebar.vue";
import { socket, state } from "@/socket";
import { rehydrateStaves, simplifyStaves } from "@/scripts/staveParser.js";
import { createStave } from "@/scripts/scoreEditor.js";
import ColumnDivider from "../components/ColumnDivider.vue";
import { store } from '../store.js'
import axios from "axios";


export default {
  name: "ScoreEditor",
  components: {
    ColumnDivider,
    Sidebar,
    ScoreEditorBar,
    RowDivider,
    Score
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
      id: null
    }
  },
  created() {
    window.addEventListener("resize", this.resize);
  },
  destroyed() {
    window.removeEventListener("resize", this.resize);
  },
  methods: {
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
    editNote() {
      this.context.svg.removeChild(this.group)

      let editingStave = this.position.stave
      let editingNote = this.position.note

      let key = this.currNote.concat("/", this.currOctave)

      let selectedNoteDuration = this.staves[editingStave].notes[editingNote].duration
      if(selectedNoteDuration === "q") {
        selectedNoteDuration =  1.0/4.0
      }
      else {
        selectedNoteDuration =  1.0/Number(selectedNoteDuration)
      }

      let newNoteDuration = 1.0/Number(this.currDuration)

      // Split Note

      // If note is same duration -> simply replace it
      if(selectedNoteDuration === newNoteDuration) {
        this.staves[editingStave].notes[editingNote] = new StaveNote({ keys: [key], duration: this.currDuration })
      }
      // If new note is smaller than the selected, split it up
      else if (selectedNoteDuration > newNoteDuration) {

        // Insert first note
        let remainder = selectedNoteDuration - newNoteDuration
        let index = editingNote + 1

        let insertRest = this.currDuration

        if(this.currType === "n"){
          insertRest = this.currDuration.concat("r")
        }

        this.staves[editingStave].notes[editingNote] = new StaveNote({ keys: [key], duration: this.currDuration })

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
      }
      this.drawScore()
    }
  },
  mounted(){
      socket.connect();

      this.div = document.getElementById("score_canvas")
      let renderer = new Renderer(this.div, Renderer.Backends.SVG)

      renderer.resize(this.div.offsetWidth, this.div.offsetHeight)
      this.renderer = renderer

      this.context = renderer.getContext()

      let recScore = store.score
      this.id = recScore.id
      let dehydratedStaves = JSON.parse(recScore.score)
      this.updateScore(true, rehydrateStaves(dehydratedStaves, this.context))


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
      <template #left>
        <button @click="moveLeft">Move Left</button>
      </template>
      <template #right>
        <button @click="moveRight">Move Right</button>
      </template>
      <template #add_stave>
        <button @click="addStave(false, 'treble', '4/4', 0)">Add Stave</button>
      </template>
      <template #delete_stave>
        <button @click="deleteStave">Delete Stave</button>
      </template>

      <template #note_type>
        <button class="letter_button" @click="this.currDuration = 'n'">
          N
        </button>
        <button class="letter_button" @click="this.currDuration = 'r'">
          R
        </button>
      </template>

      <template #durations>
        <button @click="this.currDuration = '16'">
          <img class="duration_button" src="../assets/16th.png" alt="Sixteenth"/>
        </button>
        <button @click="this.currDuration = '8'">
          <img class="duration_button" src="../assets/8th.png" alt="Eighth" />
        </button>
        <button @click="this.currDuration = '4'">
          <img class="duration_button" src="../assets/4th.png" alt="Quarter" />
        </button>
        <button @click="this.currDuration = '2'">
          <img class="duration_button" src="../assets/half.png" alt="Half" />
        </button>
        <button @click="this.currDuration = '1'">
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
          Sha
        </button>
        <button class="letter_button" @click="">
          Fla
        </button>
      </template>

      <template #edit_note>
        <button @click="editNote">Edit Note</button>
      </template>
    </ScoreEditorBar>
    <ColumnDivider>
      <div id="score_canvas" class="score_container">
      </div>
      <Sidebar />
    </ColumnDivider>
  </div>

</template>

<style scoped>
.letter_button {
  width: 55px;
  height: 50px;
}

.duration_button {
  width: 40px;
  height: 40px;
}

.score_container {
  background-color: white;
  width: 80vw;
  height:  calc(100vh - 100px);
  overflow-y: scroll;
}

.score_editor_container{
    display: flex;
    flex-direction: column;
}

</style>