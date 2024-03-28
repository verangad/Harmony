<!-- SideScroller: Used for options in the Score Editor Page -->
<script>
  export default {
    name: "SideScroller"
  }
</script>

<template>
  <div class="sidescroll_container">
    <slot>
    </slot>
  </div>
</template>

<style scoped>
  @import '../assets/sidescroller.css';
</style>