<!-- Navigation: Used for the Nav Bar in the Home page -->
<script>
  export default {
    name: "Navigation"
  }
</script>

<template>
  <nav>
    <div class="nav_item">
      <slot name="create_score">
      </slot>
    </div>
    <div class="button_container">
      <div class="nav_item">
        <h1>Harmony</h1>
      </div>
    </div>
  </nav>
</template>

<style scoped>
  @import '../assets/homeNavigation.css';
</style>