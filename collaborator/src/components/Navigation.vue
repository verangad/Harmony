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
      <button @click="">Create Score</button>
    </div>
    <div class="button_container">
      <div class="nav_item">
      TestLogo
      </div>
      
      <div class="nav_item">
        <div class="dropdown">
          <button @click="openDropdown" class="dropdown_button">Dropdown</button>
          <div id="menu_dropdown" class="dropdown_content">
            <slot>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>



<style scoped>

nav {
  overflow: hidden;
  font-family: Arial, Helvetica, sans-serif;
  display: flex;
  background: #181818;
  flex-wrap: nowrap;
  justify-content: space-between;
}

nav a {
  float: left;
  font-size: 16px;
  color: white;
  text-align: center;
  text-decoration: none;
}



@media (min-width: 1024px) {

  nav {
    text-align: left;
    font-size: 1rem;
    padding: 1rem 0;
    margin-top: 1rem;
  }
}

.nav_item {
  font-size: 16px;
  border: none;
  outline: none;
  color: white;
  padding: 10px 10px;
  background-color: inherit;
  font-family: inherit;
  margin: 0;
}

.button_container {
  overflow: hidden;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  width: 50%;
}

.dropdown {
  float: left;
  overflow: hidden;
}

.dropdown .dropdown_button {
  cursor: pointer;
  font-size: 16px;
  border: none;
  outline: none;
  color: white;
  background-color: inherit;
  font-family: inherit;
  margin: 0;
}

.navbar a:hover, .dropdown:hover .dropdown_button, .dropdown_button:focus {
  background-color: red;
}

.dropdown_content {
  display: none;
  position: absolute;
  background-color: #333;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
}

.dropdown_content a {
  float: none;
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  text-align: left;
}

/* Change color of dropdown links on hover */
.dropdown_content a:hover {
  background-color: #ddd;
}

/* Show the dropdown menu (use JS to add this class to the .dropdown-content container when the user clicks on the dropdown button) */
.show {
  display:block;
}
</style>