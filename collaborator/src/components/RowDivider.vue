<script>
export default {
  name: "RowDivider"
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
  flex-direction: column;
  justify-content: center;
}
</style>