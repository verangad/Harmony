<script>
import Box from "./Box.vue"
export default {
  name: "LoginRoom",
  data() {
    return {
      room_name: "",
      room_pass: ""
    }
  },
  components: {
    Box
  }
}
</script>

<template>
    <div class="join_container">
      <Box>
        <h1>Collaborate Score</h1>
        <div>
          <input v-model="room_name" placeholder="Room Name"/>
        </div>
        <div>
          <input v-model="room_pass" placeholder="Password"/>
        </div>
        <div>
          <button type="button" @click="">Submit</button>
        </div>
        <div>
          <button type="button" @click="">Collaborate</button>
        </div>
      </Box>
    </div>
</template>

<style scoped>
.join_container {
  width: 30vw;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: calc(100vh - 72px);
}

</style>