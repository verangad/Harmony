<!-- Box: Used for login boxes -->
<script>
  export default {
    name: "Box"
  }
</script>

<template>
  <!-- Simple centered Box Container -->
  <div class="box_container">
    <slot>

    </slot>
  </div>
</template>

<style scoped>
  @import '../assets/box.css';
</style>