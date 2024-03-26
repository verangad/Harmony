
<script>

import SetRoomBox from "./SetRoomBox.vue";
import RowDivider from "./RowDivider.vue";
import SideScroller from "./SideScroller.vue";

export default {
name: "Sidebar",
  components: {RowDivider, SetRoomBox, SideScroller}
}
</script>

<template>
 <div class="sidebar">
   <RowDivider>
    
     <div class="chord_builder">
      <RowDivider>
        <h1>Chord Builder</h1>
        <div>
          <slot name="addButton">

          </slot>
        </div>
        <div>
          <slot name="visualizer">

          </slot>
        </div>
        <div class="login_buttons">
          <slot name="submitChord">

          </slot>
          <slot name="clearChord">

          </slot>
          
        </div>

    </RowDivider>
     </div>
     <SetRoomBox/>
   </RowDivider>
 </div>
</template>

<style scoped>
@import '../assets/scrollbar.css';

.chord_builder {
  background-color: white;
  height: calc(60vh - 70px);
  width: 20vw;
}
.sidebar{
  overflow: scroll;
  width: 20vw;
  height: calc(100vh - 70px);
  overflow-y: scroll;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

@media (max-width: 1024px) {
  .sidebar{
    overflow: scroll;
    width: 300px;
    height: calc(100vh - 70px);
    overflow-y: scroll;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  .chord_builder {
    background-color: white;
    height: calc(60vh - 70px);
    width: 300px;
  }
}

</style>