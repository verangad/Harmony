<!-- LoginBox: Used for the Login input -->
<script>
  import Box from '../components/Box.vue'
  import axios from 'axios'
  import { store } from '../store.js'

  export default {
    name: "LoginBox",
    components: {
      Box
    },
    data() {
      // Input Name and Input Password to log into account
      return {
        acc_name: "",
        acc_pass: ""
      }
    },
    methods: {
      // Try and log into an account with the given name and password
      tryLogin() {
        // Send POST request to server
        axios.post("/login", {"acc_name": this.acc_name, "acc_pass": this.acc_pass}, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
        .then((resp) => {
          // On 200 response, store user data and move to home
          store.userData = resp.data
          this.$router.push({path: '/home'})
        })
        .catch((error) => {
          console.log(error);
        })
      }
    }
  }
</script>

<template>
  <div class="enter_details">
    <div class="center">
      <Box>
        <h1>Login</h1>
        <div class="input_container">
          <input v-model="acc_name" placeholder="Username"/>
          <input v-model="acc_pass" placeholder="Password"/>
        </div>
        <div class="login_buttons">
          <button type="button" @click="tryLogin">Submit</button>
          <slot>
          </slot>
        </div>
      </Box>
    </div>
  </div>
</template>

<style scoped>
  @import '../assets/base.css';

  h1 {
    font-size: 60px;
  }

  /* Input Size */
  .enter_details {
    width: 40%;
  }

  /* Center box */
  .center {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    min-height: calc(100vh - 72px);
  }
</style>