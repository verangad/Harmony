<script>
import RowDivider from "@/components/RowDivider.vue"
export default {
  name: "ChordBuilder",
  components: {
    RowDivider
  }
}
</script>

<template>
<div class="container">
    <RowDivider>
        <slot name="notePicker">

        </slot>
        <slot name="visualizer">

        </slot>
        <slot name="submitChord">

        </slot>
    </RowDivider>
   
</div>
</template>

<style scoped>
.container{
    height: 100%;
    width: 100%;
}

</style>