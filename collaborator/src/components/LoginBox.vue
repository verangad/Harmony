<script>
import Box from '../components/Box.vue'
import axios from 'axios'

export default {
  name: "LoginBox",
  components: {
    Box
  },
  data() {
    return {
      acc_name: "",
      acc_pass: ""
    };
  },
  methods: {
    tryLogin() {
     // this.$router.push({path: '/home'})

      axios.post("/login", {"acc_name": this.acc_name, "acc_pass": this.acc_pass}, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
          .then((resp) => {
            console.log(resp)
            localStorage.setItem('userToken', resp.data)
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
h1{
  font-size: 60px;
}

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