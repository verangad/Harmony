<script>
export default {
  name: "Navigation",
  methods: {
    openDropdown (){
      document.getElementById("menu_dropdown").classList.toggle("show");
    }
  }
}

</script>

<template>
  <nav>
    <div class="nav_item">
      <slot name="create_score">
      </slot>
    </div>
    <div class="button_container">
      <div class="nav_item">
        <h1>Test</h1>
      </div>
    </div>
  </nav>
</template>



<style scoped>

nav {
  overflow: hidden;
  font-family: Arial, Helvetica, sans-serif;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  width: 100%;
  height: 70px;
  align-items: center;
}

nav a {
  float: left;
  font-size: 16px;

  text-align: center;
  text-decoration: none;
}



@media (min-width: 1024px) {

  nav {
    text-align: left;
    font-size: 1rem;

  }
}

.nav_item {
  width: 50%;
  font-size: 16px;
  outline: none;
  color: black;
  padding: 10px 10px;
  background-color: inherit;
  font-family: inherit;
  margin: 0;
}

.button_container {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  width: 50%;
}

/* Show the dropdown menu (use JS to add this class to the .dropdown-content container when the user clicks on the dropdown button) */
.show {
  display:block;
}


</style>