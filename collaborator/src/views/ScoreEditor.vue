<script>
import { Vex } from 'vexflow';
const { Renderer, Stave, Voice, Formatter, StaveNote } = Vex.Flow;
import ScoreEditorBar from '../components/ScoreEditorBar.vue'
import Score from "../components/Score.vue"
import RowDivider from '@/components/RowDivider.vue';

export default {
  name: "ScoreEditor",
  components: {
    ScoreEditorBar,
    RowDivider,
    Score
  },
  data() {
    return {
      score: null,
      notes: null
    }
  },
  methods: {
    addNote() {
      this.notes.push(
            // A C-Major chord.
            new StaveNote({ keys: ["c/4", "e/4", "g/4"], duration: "q" }))
        // Create a voice in 4/4 and add above notes
        const voice = new Voice({ num_beats: 4, beat_value: 4 });
        voice.addTickables(this.notes);

        // Format and justify the notes to 400 pixels.
        new Formatter().joinVoices([voice]).format([voice], 350);

        // Render voice
        voice.draw(context, this.score);

    }
  },
  mounted(){


        // Create an SVG renderer and attach it to the DIV element named "boo".
        const div = document.getElementById("score_canvas");
        const renderer = new Renderer(div, Renderer.Backends.SVG);

        // Configure the rendering context.
        renderer.resize(500, 500);
        const context = renderer.getContext();

        // Create a stave of width 400 at position 10, 40 on the canvas.
        const stave = new Stave(10, 40, 400);
        this.score = stave
        // Add a clef and time signature.
        this.score.addClef("treble").addTimeSignature("4/4");

        // Connect it to the rendering context and draw!
        this.score.setContext(context).draw();

                // Create the notes
        this.notes = [
            // A quarter-note C.
            new StaveNote({ keys: ["c/4"], duration: "q" }),

            // A quarter-note D.
            new StaveNote({ keys: ["d/4"], duration: "q" }),

            // A quarter-note rest. Note that the key (b/4) specifies the vertical
            // position of the rest.
            new StaveNote({ keys: ["b/4"], duration: "qr" }),
            

            // A quarter-note rest. Note that the key (b/4) specifies the vertical
            // position of the rest.
            new StaveNote({ keys: ["b/4"], duration: "qr" }),
        ];

        // Create a voice in 4/4 and add above notes
        const voice = new Voice({ num_beats: 4, beat_value: 4 });
        voice.addTickables(this.notes);

        // Format and justify the notes to 400 pixels.
        new Formatter().joinVoices([voice]).format([voice], 350);

        // Render voice
        voice.draw(context, this.score);

    }
}   

</script>

<template>
  <div class="score_editor_container">  
    <ScoreEditorBar>
      <button @click="addNote">Add Note</button>
    </ScoreEditorBar>
    <Score>
      <div id="score_canvas">
      </div>
    </Score>
  </div>

</template>

<style scoped>
.score_editor_container{
    display: flex;
    flex-direction: column;
}

</style>