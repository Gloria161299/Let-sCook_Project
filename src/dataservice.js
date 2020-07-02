import axios from "axios";
import firebase from "@firebase/app";
import "@firebase/firestore";

firebase.initializeApp({
  apiKey: "AIzaSyDyObvcSGWJq3n_3gIBFpwU9p0nGLJ1PUw",
  authDomain: "let-scook-faf45.firebaseapp.com",
  projectId: "let-scook-faf45"
});
var db = firebase.firestore();

var user = localStorage.getItem("username");
var apiKey = "apiKey=3ae6549343a743adb5b89efe15a6f9b3";
//altre apiKey nel caso in cui dovessero finire le richieste disponibili
//1cf2fe0bbd904eaf9bdb6a6843b2343a
//0a8d11864ab2451ea83d6f266a2175cf
//3b1d5bf5c131428ebfe520fa883a4bb7
//93dce67baab74fdda62f7c8c2231ec5f
//3f0e13349b334a5a9caf2444599519bc
//1c7bfc608b094555bbc5406291e2cad8
//0dd35a274d3444c89cd49348bd80f927
//3ae6549343a743adb5b89efe15a6f9b3

export default {
  isAuthenticated() {
    //funziona con la cache, finchè non vengono eliminati i dati, la cache permette di riconoscere l'utente
    return !!localStorage.getItem("username");
  },
  login(name, surname) {
    localStorage.setItem("username", name + " " + surname);
    user = localStorage.getItem("username");
  },
  logout(name, surname) {
    localStorage.removeItem("username", name + " " + surname);
  },

  getFoods() {
    return axios.get(
      "https://api.spoonacular.com/recipes/random?number=20&" + apiKey
    );
  },

  getFoodDetails(id) {
    return axios.all([
      axios.get(
        "https://api.spoonacular.com/recipes/" + id + "/information?&" + apiKey
      ),
      axios.get(
        "https://api.spoonacular.com/recipes/" +
          id +
          "/ingredientWidget.json?&" +
          apiKey
      ),
      axios.get(
        "https://api.spoonacular.com/recipes/" + id + "/similar?&" + apiKey
      )
    ]);
  },

  getInformations(id) {
    return axios.get(
      "https://api.spoonacular.com/recipes/" + id + "/information?&" + apiKey
    );
  },

  searchRecipes(text) {
    if (!text || text.length < 2) {
      return new Promise(resolve => {
        resolve([]);
      });
    }
    return axios
      .get(
        "https://api.spoonacular.com/recipes/autocomplete?number=25&query=" +
          text +
          "&" +
          apiKey
      )
      .then(data => {
        return data.data.filter(element => element.title.indexOf(text) >= 0);
      });
  },

  getMyComments() {
    return db
      .collection("UserComments")
      .where("utente", "==", user)
      .get()
      .then(data => {
        return data.docs.map(doc => doc.data());
      });
  },

  deleteMyComments(text, foodId) {
    var thatComment = db
      .collection("UserComments")
      .where("comment.ricettaId", "==", foodId)
      .where("comment.testo", "==", text)
      .where("utente", "==", user);
    thatComment.get().then(query => {
      query.forEach(doc => {
        doc.ref.delete();
      });
    });
  },

  getRecipeComments(foodId) {
    return db
      .collection("UserComments")
      .where("comment.ricettaId", "==", foodId)
      .get()
      .then(data => {
        return data.docs.map(doc => doc.data());
      });
  },

  setRecipeComment(text, foodId) {
    return db
      .collection("UserComments")
      .doc() //documento nuovo
      .set({
        utente: user,
        comment: {
          ricettaId: foodId,
          testo: text
        }
      });
  },

  setUserRecipes(food) {
    return db
      .collection("UserRecipes")
      .doc()
      .set({
        ricettaId: food.id,
        utente: user
      });
  },
  getUserRecipes() {
    return db
      .collection("UserRecipes")
      .where("utente", "==", user)
      .get()
      .then(data => {
        return data.docs.map(doc => doc.data().ricettaId);
      });
  },
  deleteUserRecipes(food) {
    var savedDoc = db
      .collection("UserRecipes")
      .where("utente", "==", user)
      .where("ricettaId", "==", food.id);
    savedDoc.get().then(query => {
      query.forEach(doc => {
        doc.ref.delete();
      });
    });
  },

  getCategory(tag) {
    return axios.get(
      "https://api.spoonacular.com/recipes/random?number=20&tags=" +
        tag +
        "&" +
        apiKey
    );
  },

  getMealPlan() {
    return axios.get(
      " https://api.spoonacular.com/mealplanner/generate?timeFrame=day&" +
        apiKey
    );
  }
};
