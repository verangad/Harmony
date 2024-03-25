<script>
import ColumnDivider from "./ColumnDivider.vue";
import Dropdown from "./Dropdown.vue";
import SideScroller from "./SideScroller.vue";
export default {
  name: "ScoreEditorBar",
  components: {
    SideScroller,
    Dropdown
  }
}

</script>

<template>
  <nav>
    <div class="nav_item">
      <div class="left_buttons">
        <button @click="this.$router.push('/home')">Back</button>
        <div class="move_buttons">
          <slot name="left">
          </slot>

          <slot name="right">
          </slot>
        </div>
        <div class="stave_buttons">
          <slot name="add_stave">
          </slot>
          <slot name="delete_stave">
          </slot>
        </div>
      </div>
    </div>

    <div class="nav_item">
      <slot name="note_type">
      </slot>
    </div>

    <div class="nav_item">
      <SideScroller>
        <slot name="durations">

        </slot>
      </SideScroller>
    </div>

    <div class="nav_item">
      <SideScroller>
        <slot name="octave">

        </slot>
      </SideScroller>
    </div>

    <div class="nav_item">
      <SideScroller>
        <slot name="note">

        </slot>
      </SideScroller>
    </div>

    <div class="nav_item">
      <slot name="accidental">

      </slot>
    </div>

    <div class="nav_item">
      <slot name="edit_note">
      </slot>
    </div>
  </nav>
</template>



<style scoped>

.left_buttons {
  width: 350px;
  display: flex;
  background: #181818;
  flex-wrap: nowrap;
  justify-content: space-between;
}
.move_buttons {

}

nav {
  overflow: auto;
  font-family: Arial, Helvetica, sans-serif;
  display: flex;
  background: #181818;
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
    text-align: left;
    font-size: 1rem;
    padding: 0 0;
    margin-top: 1rem;
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
}

.button_container {
  overflow: hidden;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  width: 50%;
}



::-webkit-scrollbar {
  height: 5px;
  width: 4px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}

</style>