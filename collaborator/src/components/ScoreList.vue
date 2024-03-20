<script>
export default {
  name: "ScoreList",

}
</script>

<template>
<div class="score_container">
  <div class="score_container_header">
    Scores
  </div>
  <div class="score_grid">

    <slot>
      
    </slot>
  </div>
</div>
</template>

<style scoped>

.score_grid {
  display: grid;
  width: 100%;
  height: calc(100% - 60px);
  grid-template-columns: auto auto auto auto;
  justify-content: start;

  overflow-y: scroll;
}

.score_container_header {
  width: 100%;
  height: 60px;
  color: white;
  display: flex;
  justify-content: center;
  background: black;
}

.score_container {
  background: #ffffff;
  padding: 10px;
  color: black;
  width: 70vw;
  height: 100vh;
  border-radius: 20px;
  flex-direction: column;

}
</style>