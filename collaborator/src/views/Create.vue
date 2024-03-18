<script>
import Box from '../components/Box.vue'
import axios from "axios";
export default {
  name: "Create",
  data() {
    return {
      create_name: "",
      create_pass: ""
    };
  },
  components: {Box},
  methods: {
    tryCreate(){
      axios.post("/create",{ "create_name": this.create_name, "create_pass": this.create_pass }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
    }
  }
}
</script>

<template>
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
      <div>
        <button type="button" @click="tryCreate">Submit</button></div>
      <div>
        <button type="button" @click="$router.push('/')">Login</button>
      </div>
    </Box>
  </div>
</template>

<style scoped>
.center {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: 100vh;
}
</style>