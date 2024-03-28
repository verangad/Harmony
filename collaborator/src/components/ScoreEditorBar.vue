<!-- ScoreEditorBar: Used for the Nav Bar in the Score Editor page -->
<script>
import ColumnDivider from "./ColumnDivider.vue";
import SideScroller from "./SideScroller.vue";
import RowDivider from "./RowDivider.vue";

export default {
    name: "ScoreEditorBar",
    components: {
      ColumnDivider,
      RowDivider,
      SideScroller,
    }
  }
</script>

<template>
  <nav>
    <div class="nav_item">

      <div class="left_buttons">

        <slot name="back_button">
        </slot>

        <div class="move_buttons">
          <RowDivider>
            <div class="dual_button_container">

              <slot name="left">
              </slot>

              <slot name="right">
              </slot>

            </div>
            <div class="text">
              Move Left/Right
            </div>
          </RowDivider>
        </div>

        <div class="stave_buttons">
          <RowDivider>
            <div class="dual_button_container">
              <slot name="add_stave">
              </slot>
              <slot name="delete_stave">
              </slot>
            </div>
            <div class="text">
              Add/Remove Stave
            </div>
          </RowDivider>
        </div>
      </div>
    </div>

    <div class="nav_item">
      <RowDivider>
        <div class="dual_button_container">
          <slot name="note_type">
          </slot>
        </div>
        <div class="text">
          Normal/Rest
        </div>
      </RowDivider>
    </div>

    <div class="nav_item">
      <RowDivider>
        <SideScroller>
          <slot name="durations">
          </slot>
        </SideScroller>
        <div class="text">
          Duration
        </div>
      </RowDivider>
    </div>

    <div class="nav_item">
      <RowDivider>
        <SideScroller>
          <slot name="octave">
          </slot>
        </SideScroller>
        <div class="text">
          Octave
        </div>
      </RowDivider>
    </div>

    <div class="nav_item">
      <RowDivider>
        <SideScroller>
          <slot name="note">
          </slot>
        </SideScroller>
        <div class="text">
          Note
        </div>
      </RowDivider>
    </div>

    <div class="nav_item">
      <RowDivider>
        <div class="dual_button_container">
          <slot name="accidental">
          </slot>
        </div>

        <div class="text">
          Natural/Sharp/Flat
        </div>
      </RowDivider>
    </div>

    <div class="nav_item">
      <slot name="edit_note">
      </slot>
    </div>

  </nav>
</template>

<style scoped>
  @import '../assets/base.css';
  @import '../assets/scrollbar.css';
  @import '../assets/scoreEditorNavigation.css';
</style>