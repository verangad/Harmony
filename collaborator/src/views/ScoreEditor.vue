<script>
import { Vex } from 'vexflow';
import ScoreEditorBar from '../components/ScoreEditorBar.vue'

export default {
  name: "ScoreEditor",
  components: {
    ScoreEditorBar
  },
  mounted(){
        const { Renderer, Stave } = Vex.Flow;

        // Create an SVG renderer and attach it to the DIV element named "boo".
        const div = document.getElementById("score_canvas");
        const renderer = new Renderer(div, Renderer.Backends.SVG);

        // Configure the rendering context.
        renderer.resize(500, 500);
        const context = renderer.getContext();

        // Create a stave of width 400 at position 10, 40 on the canvas.
        const stave = new Stave(10, 40, 400);

        // Add a clef and time signature.
        stave.addClef("treble").addTimeSignature("4/4");

        // Connect it to the rendering context and draw!
        stave.setContext(context).draw();
    }
}   

</script>

<template>
  <div class="score_editor_container">  
    <ScoreEditorBar />
    
    <div id="score_canvas">
    </div>
  </div>

</template>

<style scoped>
.score_editor_container{
    display: flex;
    flex-direction: column;
}

</style>