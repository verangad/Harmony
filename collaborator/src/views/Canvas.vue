<script>
  import { loadScript } from "vue-plugin-load-script";
  import {collection} from "firebase/firestore/lite";
  import SpacerContainer from "../components/SpacerContainer.vue";


  export default {
    components: {SpacerContainer},
    data() {
      return { canvas: null}
    },
    mounted() {

      loadScript("https://cdn.socket.io/4.7.4/socket.io.min.js")
          .then(() => {
            // Script is loaded, do something
          })
          .catch(() => {
            // Failed to fetch script
          });
      loadScript("https://cdnjs.cloudflare.com/ajax/libs/fabric.js/4.0.0/fabric.min.js")
          .then(() => {
            this.canvas = new fabric.Canvas('canvas');

            let rect = new fabric.Rect({
              left: 0,
              top: 0,
              fill: 'white',
              width: this.canvas.width,
              height: this.canvas.height
            });

            this.canvas.add(rect);
            this.canvas.isDrawingMode = true;

            this.canvas.on('object:added', function(options) {
              console.log(options)
              /*
              if(options.target && ownObj)
              {
                let object = options.target
                //console.log(object)
                //socket.emit('draw',  object)
              }
              ownObj = true
              */
            })


          })
          .catch(() => {
            // Failed to fetch script
          });

    }
  }
</script>

<template>
  <div class="about">


    <SpacerContainer>
      <label for="color_picker">Colour</label><input type="color" id="color_picker" value="#000000"/>
      <div class="size_picker">
        <input type="range" min="1" max="100" value="5" class="slider" id="size_slider" oninput="rangeValue.innerText = this.value">
        <p id="rangeValue">5</p>
      </div>
    </SpacerContainer>
    <canvas id="canvas" class="canvas" width="1000" height="1000">
      Go Canvas!
    </canvas>
    <button onclick="enc()">Click Me!</button>






  </div>
</template>

<style>

</style>
