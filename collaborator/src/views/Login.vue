<script>
import Box from '../components/Box.vue'
import axios from 'axios'

export default {
  name: "Login",
  data() {
    return {
      acc_name: "",
      acc_pass: ""
    };
  },
  components: {Box},
  methods: {
    tryLogin(){
      this.$router.push({ path: '/home' })
      /*
      axios.post("/login",{ "acc_name": this.acc_name, "acc_pass": this.acc_pass }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      .then((resp) => {
        console.log(resp)
        localStorage.setItem('userToken',resp)
        this.$router.push({ path: '/voice' })
      })
      .catch((error) => {
        console.log(error);
      })
      */
    }
  }
}

</script>

<template>
  <div class="center">
    <Box>
      <h1>Login</h1>
      <div>
        <input v-model="acc_name" placeholder="Username"/>
      </div>
      <div>
        <input v-model="acc_pass" placeholder="Password"/>
      </div>
      <div>
        <button type="button" @click="tryLogin">Submit</button>
      </div>
      <div>
        <button type="button" @click="$router.push('/create')">Create Account</button>
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