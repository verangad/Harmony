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

.sidescroll_container {
  background-color: white;
  color: black;
  width: 200px;
  overflow: auto;
  white-space: nowrap;
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