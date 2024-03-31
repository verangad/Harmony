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
      // For v-if, show create or login box
      return {
        is_login: true
      }
    },
  }
</script>

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
                  <h5>Create music together.</h5>
                </div>
              </RowDivider>
            </div>
          </div>

          <div class="background_container">
            <div class="img_container">
              <img class="piano_img" src="../assets/piano.png" alt="Piano.">
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
  @import '../assets/login.css';
</style>