<template>
  <div class="container">
    <div v-if="userComments.length > 0">
      <p class="headline">My Comments</p>
      <div class="md-layout">
        <div
          class="md-layout-item md-size-25 md-medium-size-33 md-small-size-50 md-xsmall-size-100"
          v-for="userComment in userComments"
          :key="userComment.testo"
        >
          <md-card md-with-hover class="card-size">
            <div @click="goToComment(userComment.id)">
              <md-card-area>
                <md-card-header>
                  <div class="textcard md-title">
                    <b>{{userComment.recipeTitle}}</b>
                  </div>
                </md-card-header>
                <md-card-media>
                  <img :src="userComment.imageRecipe" alt="ImageRecipe">
                </md-card-media>
                <md-card-content>
                  <div>
                    <p class="comment">"{{userComment.comment}}"</p>
                  </div>
                </md-card-content>
              </md-card-area>
            </div>
            <md-menu md-size="big">
              <md-button class="md-icon-button" md-menu-trigger>
                <md-icon>more_vert</md-icon>
              </md-button>
              <md-menu-content>
                <md-menu-item @click="removeComment(userComment.comment, userComment.id)">
                  <span>Remove</span>
                  <md-icon>delete</md-icon>
                </md-menu-item>
              </md-menu-content>
            </md-menu>
          </md-card>
        </div>
      </div>
    </div>
    <div v-if="userComments.length == 0" class="md-layout md-gutter">
      <md-empty-state class="empty" md-icon="comment" md-label="Nothing in My Comments" md-rounded></md-empty-state>
    </div>
  </div>
</template>

<script>
import DataService from "../dataservice";

export default {
  name: "App",
  data: function() {
    return {
      userComments: []
    };
  },

  created: function() {
    this.load();
  },
  methods: {
    load() {
      this.userComments = [];
      DataService.getMyComments().then(data => {
        data.forEach(doc => {
          var userComment = {
            recipeTitle: "",
            comment: doc.comment.testo,
            imageRecipe: "",
            id: ""
          };
          DataService.getInformations(doc.comment.ricettaId).then(food => {
            userComment.recipeTitle = food.data.title;
            userComment.imageRecipe = food.data.image;
            userComment.id = food.data.id;
          });
          this.userComments.push(userComment);
        });
      });
    },

    goToComment(userCommentId) {
      this.$router.push({ path: "/food/" + userCommentId });
    },

    removeComment(userCommentComment, userCommentId) {
      DataService.deleteMyComments(userCommentComment, userCommentId);
      setTimeout(() => {
        this.load();
      }, 1000);
    }
  }
};
</script>

<style>
.comment {
  font-size: 18px;
}
.card-size {
  width: 75%;
  height: 105%;
}
</style>