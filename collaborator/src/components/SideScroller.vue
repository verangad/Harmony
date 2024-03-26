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

.sidescroll_container {
  background-color: white;
  color: black;
  width: 200px;
  overflow: auto;
  white-space: nowrap;
  border: 2px solid black;
}

@media (max-width: 1024px) {
  .sidescroll_container {
    background-color: white;
    color: black;
    width: 10vw;
    overflow: auto;
    white-space: nowrap;
  }
}

.sidescroll_container a {
  display: inline-block;

  text-align: center;
  padding: 14px;
  text-decoration: none;
}

.sidescroll_container a:hover {
  background-color: white;
}

</style>