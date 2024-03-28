<script>
  import { loadScript } from "vue-plugin-load-script"
  import {collection} from "firebase/firestore/lite"
  import SpacerContainer from "../components/SpacerContainer.vue"
  import Navigation from '../components/Navigation.vue'
  import ScoreList from '../components/ScoreList.vue'
  import Canvas from '../components/Canvas.vue'
  import LoginRoom from '../components/LoginRoom.vue'
  import RowDivider from "@/components/RowDivider.vue"
  import ColumnDivider from "@/components/ColumnDivider.vue"
  import ScoreListItem from "@/components/ScoreListItem.vue"
  import HorizontalLine from "@/components/HorizontalLine.vue"
  import axios from "axios";
  import { store } from '../store.js'


  export default {
    components: {SpacerContainer,
    Navigation,
    ScoreList,
    Canvas,
    LoginRoom,
    RowDivider,
    ColumnDivider,
    ScoreListItem,
      HorizontalLine},
    data() {
      return { 
        canvas: null,
        showCanvas: false,
        scores: ["test"]
      }
    },
    methods: {
      swapToCollaborate(){
        this.showCanvas = false
      },
      swapToCanvas(){
        this.showCanvas = true
      },
      getScores() {

        let login = store.userData
        axios.post("/getScores", {"user": login}, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
            .then((resp) => {
              this.scores = resp.data
            })
            .catch((error) => {
              console.log(error);
            })
      },
      createScore(){
        let login = store.userData
        axios.post("/createScore", {"user": login}, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
            .then((resp) => {
              this.getScores()

            })
            .catch((error) => {
              alert("Score and Password does not exist.");
              console.log(error);
            })
      },
      editScore(chosenScore){
        store.score = chosenScore
        this.$router.push({
          name: 'scoreeditor'})
      }
    },
    mounted() {
      this.getScores()
    }
  }
</script>

<template>
  <RowDivider>
    <Navigation>
      <template #create_score>
        <button class="createScore" @click="createScore">Create Score</button>
      </template>
    </Navigation>
    <HorizontalLine />
    <ColumnDivider>
      <ScoreList>
        <ul v-for="score in scores" :key="score.id">
          <ScoreListItem :scoreData="score">
            <template #image>
              <img id="prev_img" class="preview_img" :src="score.image">
            </template>
            <template #button>
              <button class="score_list_button" @click="editScore(score)">Edit</button>
            </template>
            <template #score_details>

              <div class="preview_text">
                {{ score.name }} (id: {{ score.id }})
              </div>


            </template>
          </ScoreListItem>
        </ul>
      </ScoreList>

      <!-- <Canvas v-if="this.showCanvas" /> -->
      <LoginRoom v-if="!this.showCanvas" />
    </ColumnDivider>
  </RowDivider>




</template>

<style>
@import '../assets/base.css';

.preview_text {
  width: 100%;
  height: 60px;
  background-color: white;
  text-align: center;
}
.score_list_button {
  width: 100%;
}

.preview_img {
  width: 146px;
  height: 146px;
}
</style>
