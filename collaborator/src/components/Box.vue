<script>
export default {
  name: "Box"
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

  background: rgb(255, 255, 255, 0.2);
  border-style: solid;
  border-color: white;
  color: black;
  width: 25vw;
  height: 600px;
  padding-bottom: 20px;
  flex-direction: column;
  align-items: stretch;
}

.box_container::before {
  position: absolute;
  content: '';
  height: 600px;
  width: 25vw;
  display: block;
  z-index: -1;
  background: rgb(255, 255, 255,.4);
  transform: rotate(4deg);
}


</style>