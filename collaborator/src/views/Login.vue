<script>
import Box from '../components/Box.vue'
import RowDivider from "../components/RowDivider.vue";
import ColumnDivider from "../components/ColumnDivider.vue";
import LoginLogo from '../components/LoginLogo.vue'
import HorizontalLine from '../components/HorizontalLine.vue'
import axios from 'axios'

export default {

  name: "Login",
  data() {
    return {
      acc_name: "",
      acc_pass: ""
    };
  },
  components: {
    Box,
    LoginLogo,
    HorizontalLine,
    RowDivider,
    ColumnDivider},
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
  <RowDivider>
    <LoginLogo />
    <HorizontalLine />
    <ColumnDivider>
      <div class="info">
        <div class="info_box">
          <RowDivider>
            <div>
              <h1 class="details_header">Test.</h1>
              <h3>Collaborative Score Editor.</h3>
            </div>
          </RowDivider>
        </div>
      </div>
      <div class="background_container">
        <div class="img_container">
          <img class="vinyl_img" src="../assets/vinyl.png" alt="Vinyl.">
        </div>
      </div>
      <div class="enter_details">
        <div class="center">
          <Box>
            <h1>Login</h1>
            <div>
              <input v-model="acc_name" placeholder="Username"/>
            </div>
            <div>
              <input v-model="acc_pass" placeholder="Password"/>
            </div>
            <div class="login_buttons">
              <button type="button" @click="tryLogin">Submit</button>
              <button type="button" @click="$router.push('/create')">Create Account</button>
            </div>
          </Box>
        </div>
      </div>
    </ColumnDivider>
  </RowDivider>

</template>

<style scoped>
@import '../assets/base.css';
h1 {
  font-weight: bold;
}
.img_container {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: calc(100vh - 72px);
}
.background_container {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: -50;
}
.vinyl_img {
  width: 50vh;
  height: 50vh;
}

.details_header {
  font-size: 4em;
  line-height: 34px;
  height: 25px;
}

.info_box {
  width: 100%;
  height: 100%;
  padding: 20px;
}

.enter_details {
  width: 40%;
}

.info {
  display: flex;
  align-items: center;
  width:60%;
}

.center {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: calc(100vh - 72px);
}


input {
  height: 50px;
  width: 80%;
  border-radius: 10px;
  border: 4px solid;
  border-color: #8dd9f2;
}

button {
  background-color: #8dd9f2;
  height: 50px;
  height: 50px;
  width: 30%;
  border-radius: 20px;
  border: 1px transparent;
  transition-duration: 0.4s;
}
button:hover {
  border: 4px solid;
  background-color: white;
  color: #8dd9f2;
}

.login_buttons {
  display: flex;
  justify-content: center;
}

</style>