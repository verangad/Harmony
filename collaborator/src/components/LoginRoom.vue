<script>
import Box from "./Box.vue"
import axios from "axios";
import { store } from '../store.js'
export default {
  name: "LoginRoom",
  data() {
    return {
      room_name: "",
      room_pass: ""
    }
  },
  components: {
    Box
  },
  methods: {
    tryJoin() {
      this.$router.push({ path: '/home' })

      axios.post("/joinScore", {"room_name": this.room_name, "room_pass": this.room_pass}, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
          .then((resp) => {
            console.log("JOINED", resp.data)
            store.score = resp.data
            this.$router.push({
              name: 'scoreeditor'})

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
h1{
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