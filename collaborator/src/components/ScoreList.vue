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
.score_grid {
  display: grid;
  width: 100%;
  height: calc(100% - 60px);

  justify-content: start;
  grid-template-columns: auto auto auto auto auto auto auto;
  grid-auto-rows: 290px;
  grid-gap:10px;
  overflow-y: scroll;
}

.score_container_header {
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: center;
  background: white;
  border: 5px solid var(--secondary_colour);
  border-radius: 20px 20px 0px 0px;

}

.text{
  font-size: 30px;
}
.score_container {
  background: (1, 1, 1, 0.4);

  color: black;
  width: 70vw;
  height: 100vh;
  border-radius: 20px;
  flex-direction: column;

}



@media (max-width: 1800px) {
  .score_grid {
    display: grid;
    width: 100%;
    height: calc(100% - 60px);
    grid-template-columns: auto auto auto auto auto;
    grid-auto-rows: 290px;
    justify-content: start;


  }
}


@media (max-width: 1600px) {
  .score_grid {
    display: grid;
    width: 100%;
    height: calc(100% - 60px);
    grid-template-columns: auto auto auto auto;
    grid-auto-rows: 290px;
    justify-content: start;


  }
}

@media (max-width: 1300px) {
  .score_grid {
    display: grid;
    width: 100%;
    height: calc(100% - 60px);
    grid-template-columns: auto auto auto;
    grid-auto-rows: 290px;
    justify-content: start;


  }

}

@media (max-width: 1000px) {
  .score_container {
    background: (1, 1, 1, 0.4);
    color: black;
    width: 70vw;
    height: 100vh;
    border-radius: 20px;
    flex-direction: column;
    overflow-y: scroll;
    overflow-x: scroll;

  }

  .score_grid {
    display: grid;
    width: 100%;
    height: calc(100% - 60px);
    grid-template-columns: auto auto;
    grid-auto-rows: 290px;
    justify-content: start;


  }
}

@media (max-width: 800px) {
  .score_grid {
    display: grid;
    width: 100%;
    height: calc(100% - 60px);
    grid-template-columns: auto;
    grid-auto-rows: 290px;
    justify-content: start;
  }

}
</style>