<!-- HorizontalLine: Used to draw a fading horizontal line across the screen -->
<script>
  export default {
    name: "HorizontalLine"
  }
</script>

<template>
  <div class="container">
    <div class="line">
    </div>
  </div>
</template>


<style scoped>
  @import '../assets/base.css';

  /* Center line */
  .container {
    display: flex;
    justify-content: center;
    width: 100%
  }

  /* Gradient line */
  .line {
    background: -moz-linear-gradient(left,  var(--background_color) 0%, #000000 25%, #000000 75%, var(--background_color) 100%);
    background: -webkit-gradient(linear, left top, right top, color-stop(0%,var(--background_color)), color-stop(25%,#000000), color-stop(75%,#000000), color-stop(100%,var(--background_color)));
    background: -webkit-linear-gradient(left,  var(--background_color) 0%,#000000 25%,#000000 75%,var(--background_color) 100%);
    width: 90%;
    height: 2px;
    border-radius: 10px;
  }
</style>