<template>
  <div class="container">
    <p class="headline">Popular Recipes</p>
    <div class="md-layout">
      <div
        class="md-layout-item md-size-25 md-medium-size-33 md-small-size-50 md-xsmall-size-100"
        v-for="(food, i) in foods"
        :key="i"
      >
        <md-card md-with-hover>
          <md-card-area>
            <div @click="goToDetails(food)">
              <md-card-media md-medium>
                <img :src="food.image">
              </md-card-media>
              <md-card-header>
                <div class="textcard md-title">{{food.title}}</div>
                <div class="md-subhead">
                  Ready in
                  <b>{{food.readyInMinutes}}</b>'
                </div>
              </md-card-header>
            </div>
          </md-card-area>
          <md-card-actions>
            <md-button class="md-icon-button" @click="saveFood(food, i)">
              <md-icon v-if="foodIndex.includes(i)">bookmark</md-icon>
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
    <div>
      <md-dialog :md-active.sync="showDialog" class="dialog">
        <md-dialog-title>Share</md-dialog-title>
        <md-dialog-content>
          <span>Share this recipe with your contacts</span>
          <md-divider style="margin-top:1%"></md-divider>
          <md-button class="md-icon-button imageShare">
            <md-icon class="md-size-2x">
              <img :src="whatsapp">
            </md-icon>
            <md-tooltip>Whatsapp</md-tooltip>
          </md-button>
          <md-button class="md-icon-button imageShare">
            <md-icon class="md-size-2x">
              <img :src="instagram">
            </md-icon>
            <md-tooltip>Instagram</md-tooltip>
          </md-button>
          <md-button class="md-icon-button imageShare">
            <md-icon class="md-size-2x">
              <img :src="twitter">
            </md-icon>
            <md-tooltip>Twitter</md-tooltip>
          </md-button>
          <md-button class="md-icon-button imageShare">
            <md-icon class="md-size-2x">
              <img :src="facebook">
            </md-icon>
            <md-tooltip>Facebook</md-tooltip>
          </md-button>
          <md-button class="md-icon-button imageShare">
            <md-icon class="md-size-2x">
              <img :src="telegram">
            </md-icon>
            <md-tooltip>Telegram</md-tooltip>
          </md-button>
          <md-button class="md-icon-button imageShare">
            <md-icon class="md-size-2x">
              <img :src="gmail">
            </md-icon>
            <md-tooltip>Gmail</md-tooltip>
          </md-button>
          <md-button class="md-icon-button imageShare">
            <md-icon class="md-size-2x">
              <img :src="gdrive">
            </md-icon>
            <md-tooltip>Save to Drive</md-tooltip>
          </md-button>
        </md-dialog-content>
      </md-dialog>
    </div>
  </div>
</template>

<script>
import DataService from "../dataservice";
import whatsapp from "../assets/whatsapp.png";
import instagram from "../assets/instagram.png";
import facebook from "../assets/facebook.png";
import twitter from "../assets/twitter.png";
import gdrive from "../assets/gdrive.png";
import gmail from "../assets/gmail.png";
import telegram from "../assets/telegram.png";

export default {
  data: function() {
    return {
      foods: [],
      showDialog: false,
      whatsapp: whatsapp,
      instagram: instagram,
      facebook: facebook,
      twitter: twitter,
      gdrive: gdrive,
      gmail: gmail,
      telegram: telegram,
      loading: false,
      foodIndex: [],
      allIdsFood: []
    };
  },
  created: function() {
    this.load();
  },
  methods: {
    load: function() {
      this.loading = true;
      this.foodIndex = [];
      this.allIdsFood = [];

      DataService.getFoods().then(data => {
        this.foods = data.data.recipes;
        this.foods.forEach(element => {
          this.allIdsFood.push(element.id);
        });
        this.checkIfIsSaved(this.allIdsFood);
        this.loading = false;
      });
    },
    checkIfIsSaved(allIdsFood) {
      DataService.getUserRecipes().then(idRicette => {
        idRicette.forEach(element => {
          if (allIdsFood.indexOf(element) >= 0) {
            //quando poi faccio loadMore vengono aggiungi gli id delle nuove ricette
            this.foodIndex.push(allIdsFood.indexOf(element));
          }
        });
      });
    },

    goToDetails(food) {
      this.$router.push({ path: "/food/" + food.id });
    },

    loadMore() {
      this.loading = true;
      DataService.getFoods().then(data => {
        this.foods = this.foods.concat(data.data.recipes); //concatena l'array precedente con il nuovo array di risultati
        let loadMoreRecipes = data.data.recipes; //i 20 che concateno con le ricette precedenti e dei quali prendo gli id e li push nella lista di tutti gli Id
        loadMoreRecipes.forEach(element => {
          this.allIdsFood.push(element.id); //aggiungo all'array degli id, gli altri id del nuovo array di risultati chiamata getFoods
        });
        this.checkIfIsSaved(this.allIdsFood);
        this.loading = false;
      });
    },

    saveFood(food, i) {
      if (this.foodIndex.includes(i) === false) {
        DataService.setUserRecipes(food);
        this.foodIndex.push(i);
      } else {
        DataService.deleteUserRecipes(food);
        var index = this.foodIndex.indexOf(i);
        this.foodIndex.splice(index, 1);
      }
    }
  }
};
</script>

<style>
.imageShare {
  margin-top: 4%;
  margin-right: 4%;
}
.md-dialog /deep/.md-dialog-container {
  width: 35%;
  height: 35%;
}
.md-progress-spinner {
  margin: 14px;
}
</style>
