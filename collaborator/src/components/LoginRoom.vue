<!-- LoginRoom: Used for the Join Room input -->
<script>
  import Box from "./Box.vue"
  import axios from "axios";
  import { store } from '../store.js'

  export default {
    name: "LoginRoom",
    data() {
      // Input Name and Input Password to log into a room
      return {
        room_name: "",
        room_pass: ""
      }
    },
    components: {
      Box
    },
    methods: {
      // Try and join a room with the given room id and password
      tryJoin() {
        // Send POST request to server to validate id and password and get score data if passed
        axios.post("/joinScore", {"room_name": this.room_name, "room_pass": this.room_pass}, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
        .then((resp) => {
          // On 200 response, store score data and move to score editor
          store.score = resp.data
          this.$router.push({name: 'scoreEditor'})
        })
        .catch((error) => {
          alert("Score and Password does not exist.");
          console.log(error);
        })
      }
    }
  }
</script>

<template>
    <div class="join_container">
      <Box>
        <h1>Collaborate Score</h1>
        <div>
          <input v-model="room_name" placeholder="Room ID"/>
          <input v-model="room_pass" placeholder="Password"/>
        </div>
        <div class="login_buttons">
          <button type="button" @click="tryJoin">Collaborate</button>
        </div>
      </Box>
    </div>
</template>

<style scoped>
  h1 {
    font-size: 45px;
  }

  .join_container {
    width: 30vw;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    min-height: calc(100vh - 72px);
  }

  /* Different container for smaller screens */
  @media (max-width: 1024px) {
    .join_container {
      width: 400px;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      min-height: calc(100vh - 72px);
      overflow: scroll;
    }
  }
</style>