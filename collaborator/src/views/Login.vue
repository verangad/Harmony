<script>
import RowDivider from "../components/RowDivider.vue";
import ColumnDivider from "../components/ColumnDivider.vue";
import LoginLogo from '../components/LoginLogo.vue'
import HorizontalLine from '../components/HorizontalLine.vue'
import LoginBox from '../components/LoginBox.vue'
import CreateBox from '../components/CreateBox.vue'


export default {

  name: "Login",
  components: {
    LoginBox,
    LoginLogo,
    HorizontalLine,
    RowDivider,
    ColumnDivider,
    CreateBox
  },
  data() {
    return {
      is_login: true
    };
  },
}

</script>
<meta content="width=device-width, initial-scale=1" name="viewport" />
<template>
  <RowDivider>
    <LoginLogo />
    <HorizontalLine />
      <ColumnDivider>
        <div class="info">
          <div class="info_box">
            <RowDivider>
              <div>
                <h1 class="details_header">Harmony.</h1>
                <h3>Collaborative Score Editor.</h3>
                <h5>By Dillan Veranga.</h5>
              </div>
            </RowDivider>
          </div>
        </div>
        <div class="background_container">
          <div class="img_container">
            <!--<img class="vinyl_img" src="../assets/vinyl.png" alt="Vinyl."> -->
          </div>
        </div>
        <LoginBox v-if="is_login">
          <button type="button" @click="this.is_login=false">Create Account</button>
        </LoginBox>
        <CreateBox v-if="!is_login">
          <button type="button" @click="this.is_login=true">Login</button>
        </CreateBox>
      </ColumnDivider>
  </RowDivider>

</template>

<style scoped>
@import '../assets/base.css';
h1 {
  font-weight: bold;
}

h5 {
  margin-block-start: 0.5em;
}

.img_container {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: calc(100vh - 72px);
}
.background_container {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: -50;
}
.vinyl_img {
  width: 50vh;
  height: 50vh;
}
.log_button {
  background-color: var(--secondary_colour);
  height: 50px;
  width: 30%;
  border-radius: 1px;
  border: 1px transparent;
  transition-duration: 0.4s;
  color: white;
}
.details_header {
  font-size: 4em;
  line-height: 34px;
  height: 25px;
  overflow: visible;
}

.info_box {
  width: 100%;
  height: 100%;
  padding: 20px;
}

.info {
  display: flex;
  align-items: center;
  width: 200px;
}

@media (min-width: 1000px) {
  .info {
    display: flex;
    align-items: center;
    width:60%;
  }

}



</style>