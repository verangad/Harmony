<script>
export default {
  name: "ScoreListItem",
  props: {
    scoreData: Object
  }
}
</script>

<template>
<div class="score_list_item_container">
  <img class="preview_img" src="../assets/vinyl.png">
  <slot>

  </slot>
  <div class="score_details">
    Score
  </div>
</div>
</template>

<style scoped>
.preview_img {
  width: 146px;
  height: 146px;
}

.score_list_item_container {
  width: 150px;
  height: 250px;
  border: 2px solid;
  border-color: black;
  flex-direction: column;
}
</style>