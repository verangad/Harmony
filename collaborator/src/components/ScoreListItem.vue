<!-- ScoreListItem: Used to display a score in an account in the ScoreList component in the Home page  -->
<script>
  export default {
    name: "ScoreListItem",
  }
</script>

<template>
  <div class="score_list_item_container">

    <slot name="image">
    </slot>

    <slot name="button">
    </slot>

    <slot name="score_details">
    </slot>

  </div>
</template>

<style scoped>
  .score_list_item_container {
    width: 150px;
    height: 250px;
    border: 2px solid;
    border-color: black;
    flex-direction: column;
  }
</style>