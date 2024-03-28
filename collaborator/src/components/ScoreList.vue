<!-- ScoreList: Used to display the account's scores in a list  -->
<script>
  export default {
    name: "ScoreList",
  }
</script>

<template>
  <div class="score_container">
    <div class="score_container_header">
      <div class="text">
        Scores
      </div>
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
  @import '../assets/scoreList.css';
</style>