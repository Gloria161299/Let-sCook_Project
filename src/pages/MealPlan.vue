<template>
  <div class="container">
    <div>
      <p class="headline">Daily Meal Plan</p>
      <p
        class="subhead"
      >Generate a meal plan with three meals per day (breakfast, lunch, and dinner):</p>
    </div>
    <div class="md-layout">
      <div
        class="md-layout-item md-size-25 md-medium-size-33 md-small-size-50 md-xsmall-size-100"
        v-for="plan in dailyPlan"
        :key="plan.id"
      >
        <md-card md-with-hover>
          <md-card-area>
            <div @click="goToDetails(plan.id)">
              <md-card-media md-medium>
                <img :src="plan.image">
              </md-card-media>
              <md-card-header>
                <div class="textcard md-title">{{plan.title}}</div>
                <div class="md-subhead">
                  Ready in
                  <b>{{plan.minutes}}</b>'
                </div>
              </md-card-header>
            </div>
          </md-card-area>
        </md-card>
        <br>
      </div>
    </div>
  </div>
</template>

<script>
import DataService from "../dataservice";

export default {
  data: function() {
    return {
      dailyPlan: [],
      baseImgUrl: "https://spoonacular.com/recipeImages/"
    };
  },
  created: function() {
    this.load();
  },
  methods: {
    load: function() {
      DataService.getMealPlan().then(data => {
        var plan = data.data.meals;
        plan.forEach(element => {
          var object = {
            minutes: element.readyInMinutes,
            title: element.title,
            image:
              this.baseImgUrl + element.id + "-312x150." + element.imageType,
            id: element.id
          };
          this.dailyPlan.push(object);
        });
      });
    },

    goToDetails(planId) {
      this.$router.push({ path: "/food/" + planId });
    }
  }
};
</script>

<style>
.subhead {
  margin-bottom: 2%;
  margin-left: 1%;
  font-size: 18px;
}
</style>