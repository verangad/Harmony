<script>
export default {
  name: "ScoreList",

}
</script>

<template>
<div class="score_container">
  <slot>

  </slot>
</div>
</template>

<style scoped>
.score_container {
  background: #ffffff;
  padding: 10px;
  color: black;
  width: 20vh;
  height: 100vh;
  border-radius: 20px;
  flex-direction: column;
  align-items: stretch;
}
</style>