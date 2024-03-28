
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

        <h1>Chord Builder</h1>
        <div class="space_container">
          <RowDivider>
            <SideScroller>
              <slot name="chordOctave">

              </slot>
            </SideScroller>
            <div class="text">
              Octave
            </div>
          </RowDivider>

          <RowDivider>
            <SideScroller>
              <slot name="chordNote">

              </slot>
            </SideScroller>
            <div class="text">
              Note
            </div>
          </RowDivider>
        </div>

        <div>
          <RowDivider>
            <div>
              <slot name="chordAccidental">

              </slot>
            </div>
            <div class="text">
              Natural/Sharp/Flat
            </div>
          </RowDivider>
        </div>
        <div class="center_container">
          <RowDivider>
            <SideScroller>
              <slot name="chordDuration">

              </slot>
            </SideScroller>
            <div class="text">
              Duration
            </div>
           </RowDivider>
        </div>
        <div class="visualizer_container">
          <slot name="visualizer">

          </slot>
        </div>
        <div class="chord_buttons">
          <slot name="addButton">

          </slot>
          <slot name="submitChord">

          </slot>
          <slot name="clearChord">

          </slot>
          
        </div>

     </div>
     <SetRoomBox/>
   </RowDivider>
 </div>
</template>

<style scoped>
@import '../assets/base.css';
@import '../assets/scrollbar.css';

.text{
  color: #a8a8a8;
  font-size: 12px;
}
.visualizer_container {
  display: flex;
  justify-content: center;
}
.space_container {
  display: flex;
  justify-content: space-around;
  padding: 0px 0px 10px 0px;
}
.center_container {
  display: flex;
  justify-content: center;
  padding: 10px 0px 10px 0px;
}
.chord_builder {
  background-color: var(--nav_color);
  color: white;
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
    color: white;
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
    background-color: var(--nav_color);
    height: calc(63vh - 70px);
    width: 300px;
  }
}

</style>