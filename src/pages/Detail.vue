<template>
  <div class="container">
    <div class="md-layout" v-if="food">
      <md-card
        class="md-layout-item md-medium-size-100 md-small-size-100 md-xsmall-size-100"
        id="card"
      >
        <md-card-header md-trasparent>
          <md-card-header-text>
            <h1 class="title margin-left">{{food.title}}</h1>
            <span class="subhead margin-left">
              Ready in
              <b>{{food.readyInMinutes}}</b> minutes -
              <b>{{food.servings}} servings</b>
            </span>
          </md-card-header-text>
          <md-card-media-actions>
            <md-card-media md-big class="md-small-hide md-xsmall-hide">
              <img :src="baseImgUrl + food.id + '-90x90.' + food.imageType" />
            </md-card-media>
            <md-card-actions>
              <md-button class="md-icon-button" @click="save(food)">
                <md-icon v-if="isSaved">bookmark</md-icon>
                <md-icon v-else>bookmark_border</md-icon>
              </md-button>
              <md-button class="md-icon-button">
                <md-icon>share</md-icon>
              </md-button>
            </md-card-actions>
          </md-card-media-actions>
        </md-card-header>
        <md-divider></md-divider>
        <md-card-content>
          <md-tabs>
            <md-tab id="tab-steps" md-label="Steps" md-icon="format_list_numbered">
              <h4 class="headline">Steps</h4>
              <div v-if="steps != null">
                <ol>
                  <li class="subhead" v-for="step in steps" :key="step.id">{{step.step}}</li>
                </ol>
              </div>
              <div v-else>
                <p>There are no steps for this recipe</p>
              </div>
            </md-tab>
            <md-tab id="tab-ingredients" md-label="Ingredients" md-icon="room_service">
              <md-list>
                <h4 class="headline">Ingredients</h4>
                <div v-for="ingredient in ingredients" :key="ingredient.id">
                  <md-list-item class="md-layout-item">
                    <img class="ingredientImage" :src="baseImgIngredientsUrl + ingredient.image" />
                    <span class="subhead">
                      {{ingredient.name}} -
                      <b>{{ingredient.amount.metric.value}} {{ingredient.amount.metric.unit}}</b>
                    </span>
                  </md-list-item>
                  <md-divider></md-divider>
                </div>
              </md-list>
            </md-tab>
            <md-tab id="tab-comments" md-label="Comments" md-icon="add_comment">
              <h4 class="headline">Comments</h4>
              <md-list>
                <md-list-item>
                  <md-avatar>
                    <img src="https://placeimg.com/40/40/people/1" alt="People" />
                  </md-avatar>
                  <div class="md-list-item-text">
                    <span>
                      <b>Serena Crustich</b>
                    </span>
                    <p>Excellent recipe, delicious!</p>
                  </div>
                </md-list-item>
                <md-divider></md-divider>
                <div v-for="commenti in usersComments" :key="commenti.ricettaId">
                  <md-list-item>
                    <md-avatar>
                      <img src="https://images.emojiterra.com/mozilla/512px/26aa.png" alt="People" />
                    </md-avatar>
                    <div class="md-list-item-text">
                      <span>
                        <b>{{commenti.utente}}</b>
                      </span>
                      <p>{{commenti.comment.testo}}</p>
                    </div>
                  </md-list-item>
                  <md-divider></md-divider>
                </div>
              </md-list>
              <div class="write-comment">
                <span>Add a comment:</span>
                <md-field md-inline>
                  <label>
                    <span class="md-xsmall-hide">{{user}}</span> write a comment..
                  </label>
                  <md-input v-model="mycomment"></md-input>
                  <md-button
                    class="md-primary md-raised"
                    :disabled="!mycomment"
                    @click="publicComment(food.id)"
                  >Add</md-button>
                </md-field>
              </div>
            </md-tab>
          </md-tabs>
        </md-card-content>
      </md-card>
    </div>
    <p class="simil margin-left">Similar Recipes</p>
    <div class="md-layout">
      <div
        class="md-layout-item md-size-25 md-medium-size-33 md-small-size-50 md-xsmall-size-100"
        v-for="(similarRecipe, i) in similarRecipes"
        :key="i"
      >
        <md-card md-with-hover>
          <md-card-media-cover md-solid>
            <div @click="goToDetails(similarRecipe)">
              <md-card-media>
                <img :src="baseImgUrl + similarRecipe.id + '-480x360.' + similarRecipe.imageType" />
              </md-card-media>
              <md-card-area>
                <md-card-header>
                  <div class="textcard md-title">{{similarRecipe.title}}</div>
                  <div class="md-subhead">
                    Ready in
                    <b>{{similarRecipe.readyInMinutes}}</b>'
                  </div>
                </md-card-header>
              </md-card-area>
            </div>
            <md-card-actions>
              <md-button class="md-icon-button" @click="saveSimilar(similarRecipe,i)">
                <md-icon v-if="similarSaved.includes(i)">bookmark</md-icon>
                <md-icon v-else>bookmark_border</md-icon>
              </md-button>
            </md-card-actions>
          </md-card-media-cover>
        </md-card>
        <br />
      </div>
    </div>
  </div>
</template>


<script>
import DataService from "../dataservice";
import axios from "axios";

export default {
  data: function() {
    return {
      food: null,
      ingredients: [],
      similarRecipes: [],
      //like: false,
      baseImgIngredientsUrl: "https://spoonacular.com/cdn/ingredients_100x100/",
      baseImgUrl: " https://spoonacular.com/recipeImages/",
      steps: [],
      usersComments: [],
      mycomment: "",
      user: localStorage.getItem("username"),
      isSaved: false,
      similarSaved: [],
      allId: []
    };
  },
  watch: {
    $route: function() {
      this.load();
      this.user = localStorage.getItem("username");
    }
  },
  created: function() {
    this.load();
  },
  methods: {
    load: function() {
      this.similarSaved = [];
      this.allId = [];

      DataService.getFoodDetails(this.$route.params.id).then(
        axios.spread((...data) => {
          this.food = data[0].data;
          console.log(this.food.analyzedInstructions);
          this.steps =
            this.food.analyzedInstructions.length > 0
              ? this.food.analyzedInstructions[0].steps
              : null;
              
          this.ingredients = data[1].data.ingredients;
          this.similarRecipes = data[2].data;
          this.similarRecipes.forEach(element => {
            this.allId.push(element.id); //popolo allId con gli id delle ricette simili
          });
          DataService.getRecipeComments(this.food.id).then(id => {
            this.usersComments = id;
          });

          //prende l'id delle ricette piaciute dall'utente
          DataService.getUserRecipes().then(idRicette => {
            this.isSaved = idRicette.indexOf(this.food.id) >= 0;
            //controllo se allId contiene elementi, e li aggiungo a similarSaved (che legge quali id delle ricette simili sono slavati e check)
            idRicette.forEach(element => {
              if (this.allId.indexOf(element) >= 0) {
                this.similarSaved.push(this.allId.indexOf(element));
              }
            });
          });
        })
      );
    },

    goToDetails(similarRecipe) {
      this.$router.push({ path: "/food/" + similarRecipe.id });
    },

    saveSimilar(similarRecipe, i) {
      if (this.similarSaved.includes(i) === false) {
        DataService.setUserRecipes(similarRecipe);
        this.similarSaved.push(i);
      } else {
        DataService.deleteUserRecipes(similarRecipe);
        var index = this.similarSaved.indexOf(i);
        this.similarSaved.splice(index, 1);
      }
    },

    save(food) {
      if (this.isSaved === false) {
        DataService.setUserRecipes(food);
      } else {
        DataService.deleteUserRecipes(food);
      }
      this.isSaved = !this.isSaved;
    },

    publicComment(foodId) {
      DataService.setRecipeComment(this.mycomment, foodId);
      this.user = localStorage.getItem("username");
      this.mycomment = "";
      this.load();
    }
  }
};
</script>


<style>
.margin-left {
  margin-left: 1%;
}
.title {
  margin-top: 3%;
  margin-bottom: 2%;
  font-size: 45px;
  line-height: 55px;
}
.headline {
  margin-top: 1%;
  margin-bottom: 2%;
  font-size: 24px;
}
.subhead {
  margin-top: 1%;
  margin-bottom: 1%;
  font-size: 16px;
}
.simil {
  margin-top: 5%;
  margin-bottom: 2%;
  font-size: 24px;
}
.md-tabs {
  margin-bottom: 24px;
}
.ingredientImage {
  width: 40px;
  height: 40px;
}
.write-comment {
  margin-top: 2%;
}
</style>