
<script>

import SetRoomBox from "./SetRoomBox.vue";
import RowDivider from "./RowDivider.vue";
import SideScroller from "./SideScroller.vue";
import ChordBuilder from '../components/ChordBuilder.vue';
export default {
name: "Sidebar",
  components: {RowDivider, SetRoomBox, ChordBuilder, SideScroller}
}
</script>

<template>
 <div class="sidebar">
   <RowDivider>
    
     <div class="temp">
      <RowDivider>
      
        <div>
          <slot name="addButton">

          </slot>
        </div>
        <div>
          <slot name="visualizer">

          </slot>
        </div>
        <div>
          <slot name="submitChord">

          </slot>

        </div>
        <div>
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
.temp {
  background-color: white;
  height: 400px;
  width: 20vw;
}
.sidebar{
  overflow-x: scroll;
  width: 20vw;
  height: calc(100vh - 100px);
  overflow-y: scroll;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>