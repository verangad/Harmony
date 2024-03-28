<!-- CreateBox: Used for the Create Account input -->
<script>
  import Box from '../components/Box.vue'
  import axios from "axios";

  export default {
    name: "CreateBox",
    components: {
      Box
    },
    data() {
      // Input Name and Input Password to create account
      return {
        create_name: "",
        create_pass: ""
      }
    },
    methods: {
      // Try and create an account with the given name and password
      tryCreate(){
        // Send POST request to server
        axios.post("/create",{ "create_name": this.create_name, "create_pass": this.create_pass }, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
        .then((resp) => {
          alert("Account successfully created.")
        })
        .catch((error) => {
          alert("Account already exists.")
        })
      }
    }
  }
</script>

<template>
  <div class="enter_details">
    <div class="center">
      <Box>
        <div>
          <h1>Create Account</h1>
        </div>
        <div>
          <input v-model="create_name" placeholder="Username"/>
        </div>
        <div>
          <input v-model="create_pass" placeholder="Password"/>
        </div>
        <div class="login_buttons">
          <button type="button" @click="tryCreate">Submit</button>
          <slot>
          </slot>
        </div>
      </Box>
    </div>
  </div>
</template>

<style scoped>
  @import '../assets/base.css';

  .enter_details {
    width: 40%;
  }

  .center {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    min-height: calc(100vh - 72px);
  }
</style>