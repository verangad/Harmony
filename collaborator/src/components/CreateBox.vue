<script>
import Box from '../components/Box.vue'
import axios from "axios";
export default {
  name: "CreateBox",
  components: {
    Box
  },
  data() {
    return {
      create_name: "",
      create_pass: ""
    };
  },
  methods: {
    tryCreate(){
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

.enter_details {
  width: 40%;
}

.login_buttons {
  display: flex;
  justify-content: center;
}

.center {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: calc(100vh - 72px);
}

button {
  background-color: #8dd9f2;
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

</style>