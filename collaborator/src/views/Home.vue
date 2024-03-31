<script>
  import Navigation from '../components/Navigation.vue'
  import ScoreList from '../components/ScoreList.vue'
  import LoginRoom from '../components/LoginRoom.vue'
  import RowDivider from "../components/RowDivider.vue"
  import ColumnDivider from "../components/ColumnDivider.vue"
  import ScoreListItem from "../components/ScoreListItem.vue"
  import HorizontalLine from "../components/HorizontalLine.vue"
  import axios from "axios";
  import { store } from '../store.js'

  export default {
    components: {
    Navigation,
    ScoreList,
    LoginRoom,
    RowDivider,
    ColumnDivider,
    ScoreListItem,
    HorizontalLine
    },
    data() {
      // List of scores, filled for testing, will not show up in deployment
      return {
        scores: ["test", "test", "test", "test", "test", "test", "test"]
      }
    },
    methods: {
      // Get scores from the database with the login info
      getScores() {

        let login = store.userData
        // POST request to get list of scores
        axios.post("/getScores", {"user": login}, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
        .then((resp) => {
          // Set scores on 200
          this.scores = resp.data
        })
        .catch((error) => {
          console.log(error);
        })
      },
      // Create score and add to database
      createScore(){
        let login = store.userData
        // POST request to set created score
        axios.post("/createScore", {"user": login}, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
        .then((resp) => {
          // Refresh score list on 200
          this.getScores()
        })
        .catch((error) => {
          alert("You are not connected.");
          console.log(error);
        })
      },
      // Selected score to edit
      editScore(chosenScore){
        // Store selected score in reactive localstorage
        store.score = chosenScore

        // Move to score editor with the stored selected score
        this.$router.push({
          name: 'scoreEditor'})
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

      <LoginRoom />

    </ColumnDivider>
  </RowDivider>
</template>

<style>
  @import '../assets/base.css';

  /* Text for each score list item */
  .preview_text {
    width: 100%;
    height: 60px;
    background-color: white;
    text-align: center;
  }

  /* Button for each score list item */
  .score_list_button {
    width: 100%;
  }

  /* Image for each score list item */
  .preview_img {
    width: 146px;
    height: 146px;
  }
</style>
