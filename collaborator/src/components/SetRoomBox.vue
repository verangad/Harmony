
<script>
import Box from "../components/Box.vue"
import { store } from '../store.js'
import axios from "axios";
export default {
  name: "SetRoomBox",data() {
    return {
      id: "",
      name: "",
      pass: "",
      placeholderID: "",
      placeholderPass: ""
    }
  },
  computed: {
    ownsScore() {
      console.log(store.userData)
      return store.userData === store.score.user
    }
  },
  components: {
    Box
  },
  mounted() {
    this.id = store.score.id
    this.name = store.score.name
    this.pass = store.score.pass
    this.placeholderID = "Score ID: ".concat(this.id)
    this.placeholderName = "Score Name: ".concat(this.name)
    this.placeholderPass = "Score Password: ".concat(this.pass)
  },
  methods: {
    changeName() {
      axios.post("/changeName", {"room_id": this.id, "room_name": this.name}, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
          .then((resp) => {
            this.name = store.score.name

          })
          .catch((error) => {
            window.alert("Cannot set name to: ", this.name )
            console.log(error);
          })

    },
    changePass() {
      axios.post("/changePass", {"room_id": this.id, "room_pass": this.pass}, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
          .then((resp) => {
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
.join_container {

  width: 20vw;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.box_container {

  background: rgb(255, 255, 255, 0.2);
  border-style: solid;
  border-color: white;
  color: black;
  width: 20vw;
  height: 37vh;
  flex-direction: column;
  align-items: center;
}

@media (max-width: 1024px) {
  .join_container {

    width: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  .box_container {

    background: rgb(255, 255, 255, 0.2);
    border-style: solid;
    border-color: white;
    color: black;
    width: 300px;
    height: 37vh;
    flex-direction: column;
    align-items: center;
  }
}
</style>