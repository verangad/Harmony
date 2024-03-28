<!-- Sidebar: Used for the Chord Builder and Set Room Details in the Score Editor Page -->
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
  @import '../assets/sidebar.css';
</style>