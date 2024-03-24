<script>
import { Renderer, Stave, Formatter, StaveNote } from 'vexflow';
import ScoreEditorBar from '../components/ScoreEditorBar.vue'
import Score from "../components/Score.vue"
import RowDivider from '@/components/RowDivider.vue';
import { socket, state } from "@/socket";
import { rehydrateStaves, simplifyStaves } from "@/scripts/staveParser.js";


export default {
  name: "ScoreEditor",
  components: {
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
      renderer: null
    }
  },
  created() {
    window.addEventListener("resize", this.resize);
  },
  destroyed() {
    window.removeEventListener("resize", this.resize);
  },
  methods: {
    sendSheet() {
      let simplifiedStaves = simplifyStaves(this.staves)
      socket.emit('scoreChange', simplifiedStaves )
    },
    drawScore(){
      this.group = this.context.openGroup();
      let div = document.getElementById("score_canvas")
      this.renderer.resize(div.offsetWidth, div.offsetHeight);
      for(let i = 0; i < this.staves.length; i++){
        // Draw notes
        this.staves[i].stave.setContext(this.context).draw()
        Formatter.FormatAndDraw(this.context, this.staves[i].stave, this.staves[i].notes);
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

      this.staves[editingStave].notes[editingNote] = new StaveNote({ keys: ["b/4"], duration: "q" })

      // Select Note
      this.staves[this.position.stave].notes[this.position.note].setStyle({fillStyle: "blue", strokeStyle: "blue"})

      this.drawScore()
      this.sendSheet()
    },
    addStave(initialStave, clef, timeSignature, level, firstInBar) {
      if(!initialStave){
        this.context.svg.removeChild(this.group)
      }
      let notes = []
      let stave = new Stave(this.stavePos.x, this.stavePos.y, 400);

      if(firstInBar){
        stave.addClef(clef)
        stave.addTimeSignature(timeSignature)
      }

      for(let i = 0; i < 4; i++){
        notes.push(new StaveNote({ keys: ["b/4"], duration: "qr" }))
      }

      this.staves.push({"stave": stave, "notes": notes})
      this.stavePos.x += 400

      this.drawScore()
      this.sendSheet()
    },
    updateScore(score) {
      this.staves = score
      this.context.svg.removeChild(this.group)
      this.drawScore()
    }
  },
  mounted(){
      socket.connect();


      let div = document.getElementById("score_canvas")
      let renderer = new Renderer(div, Renderer.Backends.SVG)

      renderer.resize(div.offsetWidth, div.offsetHeight)
      this.renderer = renderer

      this.context = renderer.getContext()

      this.addStave(true, "treble", "4/4", 0, true)

      socket.on('scoreChangeBroadcast', (msg) => {
        let rehydratedStaves = rehydrateStaves(msg, this.context)
        this.updateScore(rehydratedStaves)
      })
    }
}   

</script>

<template>
  <div class="score_editor_container">  
    <ScoreEditorBar>
      <button @click="editNote">Edit Note</button>
      <button @click="addStave(false, 'treble', '4/4', 0)">Add Stave</button>
      <button @click="moveLeft">Move Left</button>
      <button @click="moveRight">Move Right</button>
    </ScoreEditorBar>
    <div id="score_canvas" class="score_container">
    </div>
  </div>

</template>

<style scoped>
.score_container {
  background-color: white;
  width: 75vw;
  height: 100vh;
  overflow-y: scroll;
}

.score_editor_container{
    display: flex;
    flex-direction: column;
}

</style>