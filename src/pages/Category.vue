<template>
  <div class="container">
    <p class="headline">Category: {{path}}</p>
    <div class="md-layout">
      <div
        class="md-layout-item md-size-25 md-medium-size-33 md-small-size-50 md-xsmall-size-100"
        v-for="(categoria,i) in category"
        :key="i"
      >
        <md-card md-with-hover>
          <md-card-area>
            <div @click="goToDetails(categoria)">
              <md-card-media md-medium>
                <img :src="categoria.image">
              </md-card-media>
              <md-card-header>
                <div class="textcard md-title">{{categoria.title}}</div>
                <div class="md-subhead">
                  Ready in
                  <b>{{categoria.readyInMinutes}}</b>'
                </div>
              </md-card-header>
            </div>
          </md-card-area>
          <md-card-actions>
            <md-button class="md-icon-button" @click="saveCategory(categoria, i)">
              <md-icon v-if="foodCategoryIndex.includes(i)">bookmark</md-icon>
              <md-icon v-else>bookmark_border</md-icon>
            </md-button>
            <md-button class="md-icon-button" @click="showDialog = true">
              <md-icon>share</md-icon>
            </md-button>
          </md-card-actions>
        </md-card>
        <br>
      </div>
      <md-button class="md-accent" @click="loadMore()" v-show="!loading">Load More</md-button>
      <md-progress-spinner
        v-if="loading"
        :md-stroke="4"
        :md-diameter="30"
        md-mode="indeterminate"
        class="md-accent"
      ></md-progress-spinner>
    </div>
  </div>
</template>


<script>
import DataService from "../dataservice";

export default {
  data: function() {
    return {
      category: [],
      showDialog: false,
      path: this.$route.params.tag,
      foodCategoryIndex: [],
      allId: [],
      loading: false
    };
  },
  watch: {
    $route: function() {
      this.load();
      this.path = this.$route.params.tag.toLowerCase();
    }
  },
  created: function() {
    this.load();
  },
  methods: {
    load: function() {
      this.category = [];
      this.foodCategoryIndex = [];
      this.allId = [];

      this.loading = true;
      DataService.getCategory(this.path).then(data => {
        this.category = data.data.recipes;
        this.category.forEach(element => {
          this.allId.push(element.id);
        });
        this.checkIfIsSaved(this.allId);
        this.loading = false;
      });
    },
    checkIfIsSaved(allId) {
      DataService.getUserRecipes().then(idRicette => {
        idRicette.forEach(element => {
          if (allId.indexOf(element) >= 0) {
            this.foodCategoryIndex.push(allId.indexOf(element));
          }
        });
      });
    },

    goToDetails(categoria) {
      this.$router.push({ path: "/food/" + categoria.id });
    },

    saveCategory(categoria, i) {
      if (this.foodCategoryIndex.includes(i) === false) {
        DataService.setUserRecipes(categoria);
        this.foodCategoryIndex.push(i);
      } else {
        DataService.deleteUserRecipes(categoria);
        var index = this.foodCategoryIndex.indexOf(i);
        this.foodCategoryIndex.splice(index, 1);
      }
    },

    loadMore() {
      this.loading = true;
      DataService.getCategory(this.path).then(data => {
        this.category = this.category.concat(data.data.recipes);
        console.log(this.category.length);
        let loadMoreCategory = data.data.recipes;
        console.log(loadMoreCategory.length);
        loadMoreCategory.forEach(element => {
          this.allId.push(element.id);
        });
        console.log(this.allId.length);
        this.checkIfIsSaved(this.allId);
        this.loading = false;
      });
    }
  }
};
</script>

<style>
.md-progress-spinner {
  margin: 14px;
}
</style>