<template>
  <div class="md-layout md-alignment-center">
    <md-card class="md-layout-item md-size-30 md-xsmall-size-100 md-medium-size-50">
      <md-card-header>
        <span class="md-title">Login</span>
      </md-card-header>
      <md-card-content>
        <md-field>
          <label class="md-primary">Name</label>
          <md-input v-model="name" required></md-input>
        </md-field>
        <md-field>
          <label class="md-primary">Surname</label>
          <md-input v-model="surname" required></md-input>
        </md-field>
      </md-card-content>
      <md-card-actions>
        <md-button class="md-primary md-raised" :disabled="!surname" @click="signIn()">Sign In</md-button>
      </md-card-actions>
    </md-card>
  </div>
</template>

<script>
import DataService from "../dataservice";
export default {
  data: function() {
    return {
      name: "",
      surname: ""
    };
  },
  methods: {
    signIn: function() {
      DataService.login(this.name, this.surname);
      this.$router.push({ path: "/" });
    }
  }
};
</script>

<style>
</style>

