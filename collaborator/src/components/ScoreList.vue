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
@import '../assets/base.css';
@import '../assets/scrollbar.css';
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
  background: white;
  border: 5px solid var(--secondary_colour);
  border-radius: 20px 20px 0px 0px;
}

.score_container {
  background: (1, 1, 1, 0.4);

  color: black;
  width: 70vw;
  height: 100vh;
  border-radius: 20px;
  flex-direction: column;

}
</style>