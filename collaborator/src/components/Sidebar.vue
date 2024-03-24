
<script>
import Box from "./Box.vue";
export default {
name: "Sidebar",
  components: {Box}
}
</script>

<template>
 <div class="sidebar">
  <div>

  </div>
   <Box>

   </Box>
 </div>
</template>

<style scoped>
.sidebar{
  overflow-x: auto;
  width: 20vw;
  height: 100vh;
  overflow-y: scroll;
}
</style>