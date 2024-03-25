
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
      <div>
        <input v-model="score_name" placeholder="Score Name"/>
      </div>
      <div>
        <input v-model="score_pass" placeholder="Score Password: "/>
      </div>
      <div>
        <button type="button" @click="">Change Password</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.join_container {

  width: 15vw;
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
  width: 15vw;
  height: 200px;
  flex-direction: column;
  align-items: center;
}
</style>