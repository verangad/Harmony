
<script>
import Box from "../components/Box.vue"
export default {
  name: "SetRoomBox",
  components: {
    Box
  }
}
</script>

<template>

  <div class="join_container">
    <div class="box_container">
      <h1>Room Details</h1>
      <div class="input_container">
        <input v-model="score_name" placeholder="Score Name"/>
        <input v-model="score_pass" placeholder="Score Password: "/>
      </div>
      <div class="login_buttons">
        <button type="button" @click="">Change Password</button>
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
  height: 40vh;
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
    height: 40vh;
    flex-direction: column;
    align-items: center;
  }
}
</style>