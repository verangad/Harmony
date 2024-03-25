
<script>

import SetRoomBox from "./SetRoomBox.vue";
import RowDivider from "./RowDivider.vue";
export default {
name: "Sidebar",
  components: {RowDivider, SetRoomBox}
}
</script>

<template>
 <div class="sidebar">
   <RowDivider>
     <div class="temp">

     </div>
     <SetRoomBox>

     </SetRoomBox>

   </RowDivider>
 </div>
</template>

<style scoped>
.temp {
  background-color: black;
  height: 40vh;
}
.sidebar{
  overflow-x: auto;
  width: 20vw;
  height: calc(100vh - 100px);
  overflow-y: scroll;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>