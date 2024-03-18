<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Navigation from './components/Navigation.vue'
import Login from './views/Login.vue'

</script>

<template>
  <header>
    <div class="wrapper">
    </div>
  </header>

  <RouterView />
</template>


<style scoped>
  @import './assets/base.css';

</style>
