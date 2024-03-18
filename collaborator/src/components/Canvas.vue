<script>
export default {
  name: "Canvas",
}
</script>

<template>
    <div class="canvas_container"> <SpacerContainer>
        <label for="color_picker">Colour</label><input type="color" id="color_picker" value="#000000"/>
        <div class="size_picker">
            <input type="range" min="1" max="100" value="5" class="slider" id="size_slider" oninput="rangeValue.innerText = this.value">
            <p id="rangeValue">5</p>
        </div>
        </SpacerContainer>
        <canvas id="canvas" class="canvas" width="1000" height="1000">
          Go Canvas!
        </canvas>
        <button onclick="enc()">Click Me!</button>
    </div>
</template>

<style scoped>

</style>