<script>
export default {
  name: "Score",
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
    background-color: white;
    width: 75vw;
    height: 100vh;
    overflow-y: scroll;
}

</style>