<!-- ColumnDivider: Used for dividing a div into columns -->
<script>
  export default {
    name: "ColumnDivider"
  }
</script>

<template>
  <div class="divider">
    <slot>
    </slot>
  </div>
</template>

<style scoped>
  .divider {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
</style>