<script>
export default {
  name: "SpacerContainer"
}
</script>


<template>
  <div class="draw_settings">
    <slot>Undo</slot>
    <slot>Redo</slot>
    <slot>Slider</slot>
  </div>
</template>


<style scoped>
.draw_settings {
  width: 1000px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
}
</style>