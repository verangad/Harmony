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
      <div class="join_container_contents">
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
    </div>
</template>

<style scoped>
.join_container {
  position: relative;
  width: 100%;
}

.join_container_contents {
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>