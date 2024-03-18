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
  <slot>

  </slot>
  <div class="score_details">
    Score
  </div>
</div>
</template>

<style scoped>
.score_container {
  border-color: black;
  padding: 10px;
  border-radius: 20px;
  flex-direction: column;
  align-items: stretch;
}
</style>