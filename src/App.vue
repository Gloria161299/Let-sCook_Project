<template>
  <div id="app">
    <md-app md-waterfall md-mode="fixed">
      <md-app-toolbar class="md-primary">
        <div class="md-toolbar-section-start">
          <md-button
            class="md-icon-button"
            @click="navDrawOpen= !navDrawOpen, expandCategory= false"
            v-if="authenticated"
          >
            <md-icon>menu</md-icon>
          </md-button>
          <span class="md-title">
            #
            <b>Let</b>'s
            <b>Cook</b>
          </span>
          <div class="md-toolbar-section-end" v-if="authenticated">
            <md-autocomplete
              class="searchbar md-layout-item md-medium-size-45 md-small-size-55 md-xsmall-size-85"
              md-layout="box"
              v-model="selectedRecipe"
              :md-options="displayOptions"
              @md-changed="search"
              @md-selected="select"
            >
              <label>
                <md-icon>search</md-icon>
                <span class="md-xsmall-hide">Recipes</span>
              </label>
            </md-autocomplete>
            <div class="user md-xsmall-hide">
              <span>{{user}}</span>
            </div>

            <md-menu md-size="big" md-direction="bottom-end">
              <md-button class="md-icon-button" md-menu-trigger>
                <md-icon>arrow_drop_down</md-icon>
              </md-button>
              <md-menu-content>
                <md-menu-item @click="signOut()">
                  <span class="menu-text">Logout</span>
                  <md-icon>exit_to_app</md-icon>
                </md-menu-item>
              </md-menu-content>
            </md-menu>
          </div>
        </div>
      </md-app-toolbar>
      <md-app-drawer :md-active.sync="navDrawOpen" md-persistent="mini" v-if="authenticated">
        <md-toolbar class="md-transparent" md-elevation="0">
          <span>Navigation Recipes</span>
        </md-toolbar>

        <md-list>
          <md-list-item to="/foodslist">
            <md-icon>grade</md-icon>
            <span class="md-list-item-text">Popular</span>
            <md-tooltip class="md-xsmall-hide" md-direction="right">Popular</md-tooltip>
          </md-list-item>

          <md-list-item md-expand :md-expanded.sync="expandCategory" @click="navDrawOpen=true">
            <md-icon>widgets</md-icon>
            <span class="md-list-item-text">Categories</span>
            <md-tooltip class="md-xsmall-hide" md-direction="right">Categories</md-tooltip>

            <md-list slot="md-expand">
              <md-list-item class="md-inset" to="/category/vegan">Vegan</md-list-item>
              <md-list-item class="md-inset" to="/category/vegetarian">Vegetarian</md-list-item>
              <md-list-item class="md-inset" to="/category/dairy%20Free">Dairy Free</md-list-item>
              <md-list-item class="md-inset" to="/category/gluten%20Free">Gluten Free</md-list-item>
            </md-list>
          </md-list-item>

          <md-list-item to="/mealPlan">
            <md-icon>date_range</md-icon>
            <span class="md-list-item-text">Meal Plan</span>
            <md-tooltip class="md-xsmall-hide" md-direction="right">Meal Plan</md-tooltip>
          </md-list-item>&nbsp;
          <md-divider></md-divider>
          <md-toolbar class="md-transparent" md-elevation="0">
            <span>Personal</span>
          </md-toolbar>

          <md-list-item to="/mycomments">
            <md-icon>comment</md-icon>
            <span class="md-list-item-text">My Comments</span>
            <md-tooltip class="md-xsmall-hide" md-direction="right">Comments</md-tooltip>
          </md-list-item>

          <md-list-item to="/bookmarked">
            <md-icon>bookmarks</md-icon>
            <span class="md-list-item-text">Saved recipes</span>
            <md-tooltip class="md-xsmall-hide" md-direction="right">Saved</md-tooltip>
          </md-list-item>
        </md-list>
      </md-app-drawer>
      <md-app-content md-waterfall>
        <router-view></router-view>
      </md-app-content>
    </md-app>
  </div>
</template>

<script>
import DataService from "./dataservice";
export default {
  name: "App",
  data: function() {
    return {
      authenticated: DataService.isAuthenticated(),
      navDrawOpen: false,
      expandCategory: false,
      selectedRecipe: null,
      displayOptions: [],
      searchOptionsId: [],
      user: localStorage.getItem("username")
    };
  },
  watch: {
    //permette di osservare il cambiamento delle proprietà di un componente
    $route: function() {
      this.authenticated = DataService.isAuthenticated();
      this.user = localStorage.getItem("username");
    }
  },
  methods: {
    signOut: function() {
      DataService.logout(this.name, this.surname);
      this.$router.push({ path: "/login" });
    },

    search: function(term) {
      DataService.searchRecipes(term).then(data => {
        this.displayOptions = data.map(element => element.title);
        this.searchOptionsId = data.map(element => element.id);
      });
    },

    select: function(selected) {
      if (selected === this.$route.params.id) return;
      var listId = this.displayOptions.indexOf(selected);
      var id = this.searchOptionsId[listId];
      this.$router.push({ path: "/food/" + id });
      this.selectedRecipe = "";
    }
  }
};
</script>

<style lang="scss">
@import "~vue-material/dist/theme/engine"; // Import the theme engine

@include md-register-theme(
  "default",
  (
    primary: #d32f2f // The primary color of your application
  )
);

@import "~vue-material/dist/theme/all"; // Apply the theme

.md-app {
  height: 100vh;
  border: 1px solid rgba(#000, 0.12);
}
.md-drawer {
  width: 300px;
  max-width: calc(100vw - 125px);
}
.searchbar {
  max-width: 600px;
}
.tooltip {
  margin-top: 1px;
}
.user {
  margin-left: 2%;
}
.menu-text {
  font-size: 15px;
}
.headline {
  margin-top: 2%;
  margin-left: 1%;
  margin-bottom: 3%;
  font-size: 24px;
}
.textcard {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.empty {
  margin-top: 5%;
}
.margin-button {
  margin-left: 1%;
}
</style>
