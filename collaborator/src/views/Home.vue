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
    ScoreListItem},
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
        /*
        let login = localStorage.getItem('userToken')
        axios.post("/getScores", {"user": login}, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
            .then((resp) => {

              console.log(resp)

              this.scores = resp.data


            })
            .catch((error) => {
              console.log(error);
            })*/
      },
      createScore(){
        let login = localStorage.getItem('userToken')
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
        <button @click="createScore">Create Score</button>
      </template>
      <button type="button" @click="swapToCollaborate">Collaborate</button>
      <button type="button" @click="swapToCanvas">View Canvas</button>
    </Navigation>
    <ColumnDivider>
      <ScoreList>
        <ul v-for="score in scores" :key="score.id">
          <ScoreListItem :scoreData="score">
            <button @click="editScore(score)">{{score.name}} {{score.id}}</button>
          </ScoreListItem>
        </ul>
      </ScoreList>

      <!-- <Canvas v-if="this.showCanvas" /> -->
      <LoginRoom v-if="!this.showCanvas" />
    </ColumnDivider>
  </RowDivider>




</template>

<style>

</style>
