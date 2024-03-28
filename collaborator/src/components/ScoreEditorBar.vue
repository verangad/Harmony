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
            <div class="accidental_container">
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
            <div class="accidental_container">
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
        <div class="accidental_container">
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
        <div class="accidental_container">
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
.left_buttons {
  width: 350px;
  display: flex;
  background: var(--nav_color);
  flex-wrap: nowrap;
  justify-content: space-between;
  overflow: visible;
}
.move_buttons {

}

nav {
  overflow: scroll;
  font-family: Arial, Helvetica, sans-serif;
  display: flex;
  background: var(--nav_color);
  flex-wrap: nowrap;
  justify-content: space-between;
}

nav a {
  float: left;
  font-size: 16px;
  color: white;
  text-align: center;
  text-decoration: none;
}



@media (min-width: 1024px) {

  nav {
    overflow-y: scroll;
    background: var(--nav_color);
    text-align: left;
    font-size: 1rem;
    padding: 0 0;
    margin-top: 0rem;
  }
}
.nav_item {
  font-size: 16px;
  border: none;
  outline: none;
  color: white;
  padding: 10px 10px;
  background-color: inherit;
  font-family: inherit;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
}

.button_container {
  overflow: visible;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  width: 50%;
}

.text{
  color: #a8a8a8;
  font-size: 12px;
}

.accidental_container{
  display: flex;
  width: fit-content;
}

</style>