<script>
export default {
  name: "Dropdown",
  props: {
    name: String,
    dropdown_id: String
  },
  methods: {
    openDropdown (){
      document.getElementById("menu_dropdown").classList.toggle("show");
    }
  }

}
</script>

<template>
  <div class="dropdown">
    <button @click="openDropdown" class="dropdown_button">{{ name }}</button>
    <div id=dropdown_id class="dropdown_content">
      <slot>
      </slot>
    </div>
  </div>
</template>

<style scoped>


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