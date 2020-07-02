<template>
  <div class="container">
    <div v-if="saved.length > 0">
      <p class="headline">Saved Recipes</p>
      <div class="md-layout">
        <div
          class="md-layout-item md-size-25 md-medium-size-33 md-small-size-50 md-xsmall-size-100"
          v-for="save in saved"
          :key="save.id"
        >
          <md-card md-with-hover>
            <md-card-area>
              <div @click="goToDetails(save)">
                <md-card-media>
                  <img :src="save.image">
                </md-card-media>
                <md-card-header>
                  <div class="textcard md-title">{{save.title}}</div>
                  <div class="md-subhead">
                    Ready in
                    <b>{{save.readyInMinutes}}</b>'
                  </div>
                </md-card-header>
              </div>
            </md-card-area>
            <md-card-actions>
              <div>
                <md-button class="md-icon-button" @click="removeSave(save)">
                  <md-icon v-if="isSaved">bookmark</md-icon>
                </md-button>
                <md-button class="md-icon-button">
                  <md-icon>share</md-icon>
                </md-button>
              </div>
            </md-card-actions>
          </md-card>
          <br>
        </div>
      </div>
    </div>
    <div v-if="saved.length == 0" class="md-layout md-gutter">
      <md-empty-state
        class="empty"
        md-icon="bookmarks"
        md-label="No recipes saved"
        md-description="It seems you don't have any saved recipes yet"
        md-rounded
      >
        <md-button class="md-primary md-raised" to="/foodslist">Add Recipe</md-button>
      </md-empty-state>
    </div>
  </div>
</template>

<script>
import DataService from "../dataservice";

export default {
  name: "App",
  data: function() {
    return {
      saved: [],
      isSaved: true
    };
  },
  created: function() {
    this.load();
  },
  methods: {
    load: function() {
      this.saved = [];
      DataService.getUserRecipes().then(idlist => {
        idlist.forEach(id => {
          DataService.getInformations(id).then(food => {
            this.saved.push(food.data);
          });
        });
      });
    },

    removeSave(save) {
      DataService.deleteUserRecipes(save);
      setTimeout(() => {
        this.load();
      }, 1000);
    },

    goToDetails(save) {
      this.$router.push({ path: "/food/" + save.id });
    }
  }
};
</script>

<style>
</style>