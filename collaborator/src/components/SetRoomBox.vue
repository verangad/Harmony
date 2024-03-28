<!-- SetRoomBox: Used for the Change room name and password input -->
<script>
  import Box from "../components/Box.vue"
  import { store } from '../store.js'
  import axios from "axios";

  export default {
    name: "SetRoomBox",
    data() {
      // Id and input name and Password to change a room's name and password. ID is displayed.
      return {
        id: "",
        name: "",
        pass: "",
        placeholderID: "",
        placeholderPass: ""
      }
    },
    computed: {
      // Checks if user owns the score, if not that user cannot change the details of this room
      ownsScore() {
        return store.userData === store.score.user
      }
    },
    components: {
      Box
    },
    mounted() {
      // Set info
      this.id = store.score.id
      this.name = store.score.name
      this.pass = store.score.pass

      // Set for displaying details in input
      this.placeholderID = "Score ID: ".concat(this.id)
      this.placeholderName = "Score Name: ".concat(this.name)
      this.placeholderPass = "Score Password: ".concat(this.pass)
    },
    methods: {
      // Try and change the name of the score in the database
      changeName() {
        // Send POST request
        axios.post("/changeName", {"room_id": this.id, "room_name": this.name}, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
        .then((resp) => {
          // On 200, change the name locally
          this.name = store.score.name
        })
        .catch((error) => {
          window.alert("Cannot set name to: ", this.name )
          console.log(error);
        })
      },
      // Try and change the password of the password in the database
      changePass() {
        // Send POST request
        axios.post("/changePass", {"room_id": this.id, "room_pass": this.pass}, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
        .then((resp) => {
          // On 200, change the password locally
          this.pass = store.score.pass
        })
        .catch((error) => {
          window.alert("Cannot set pass to: ", this.pass )
          console.log(error);
        })
      }
    }
}
</script>

<template>
  <div class="join_container">
    <div class="box_container">
      <h1>Room Details</h1>

      <div class="input_container">
        <input :placeholder="this.placeholderID" readonly/>
        <input v-model="name" :placeholder="this.placeholderName"/>
        <input v-model="pass" :placeholder="this.placeholderPass"/>
      </div>

      <div class="login_buttons">
        <button v-if="ownsScore" type="button" @click="changeName">Change Name</button>
        <button v-if="ownsScore" type="button" @click="changePass">Change Password</button>
      </div>

    </div>
  </div>
</template>

<style scoped>
  @import '../assets/base.css';
  @import '../assets/setRoomBox.css';
</style>