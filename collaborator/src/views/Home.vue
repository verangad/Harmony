<script>
  import { loadScript } from "vue-plugin-load-script"
  import {collection} from "firebase/firestore/lite"
  import SpacerContainer from "../components/SpacerContainer.vue"
  import Navigation from '../components/Navigation.vue'
  import ScoreList from '../components/ScoreList.vue'
  import Canvas from '../components/Canvas.vue'
  import LoginRoom from '../components/LoginRoom.vue'


  export default {
    components: {SpacerContainer,
    Navigation,
    ScoreList,
    Canvas,
    LoginRoom},
    data() {
      return { 
        canvas: null,
        showCanvas: true,
        scores: ['score1']
      }
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

    },
    methods: {
      swapToCollaborate(){
        this.showCanvas = false
      },
      swapToCanvas(){
        this.showCanvas = true
      }
    }
  }
</script>

<template>
  <div class="home_divider_column">
    <Navigation>
      <button type="button" @click="swapToCollaborate">Collaborate</button>
      <button type="button" @click="swapToCanvas">View Canvas</button>
    </Navigation>
    <div class="home_divider_row">
      <ScoreList>
        <ul v-for="score in scores">
          <button @click="this.$router.push('/scoreeditor')">{{score}}</button>
        </ul>
      </ScoreList>
      <Canvas v-if="this.showCanvas" />
      <LoginRoom v-if="!this.showCanvas" />
    </div>
  </div>




</template>

<style>
.home_divider_column {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.home_divider_row {
  display: flex;
  flex-direction: row;
  width: 100%;
}

</style>../components/LoginRoom.vue
