<script>
export default {
  name: "Box",

}
</script>

<template>
<div class="box_container">
  <slot>

  </slot>
</div>
</template>

<style scoped>
.box_container {
  background: #ffffff;
  padding: 10px;
  color: black;
  width: 20vh;
  height: 30vh;
  border-radius: 20px;
  flex-direction: column;
  align-items: stretch;
}
</style>