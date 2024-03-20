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
.container {
  display: flex;
  justify-content: center;
  width: 100%
}

.line {
  background: -moz-linear-gradient(left,  var(--background_color) 0%, #000000 25%, #000000 75%, var(--background_color) 100%); /* FF3.6+ */
  background: -webkit-gradient(linear, left top, right top, color-stop(0%,var(--background_color)), color-stop(25%,#000000), color-stop(75%,#000000), color-stop(100%,var(--background_color))); /* Chrome,Safari4+ */
  background: -webkit-linear-gradient(left,  var(--background_color) 0%,#000000 25%,#000000 75%,var(--background_color) 100%); /* Chrome10+,Safari5.1+ */
  width: 90%;
  height: 2px;
  border-radius: 10px;
}
</style>