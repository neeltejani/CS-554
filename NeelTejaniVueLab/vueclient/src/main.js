import { createApp } from "vue";
import App from "./App.vue";
import CharacterList from "./components/CharacterList.vue";
import CharacterByID from "./components/CharacterByID.vue";
import ComicatID from "./components/ComicatID.vue";
import ComicList from "./components/ComicList.vue";
import HomePage from "./components/HomePage.vue";
import StoryList from "./components/StoryList.vue";
import StoryatID from "./components/StoryatID.vue";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "HomePage",
    component: HomePage,
  },
  {
    path: "/api/characters/page/:pagenum",
    name: "CharacterList",
    component: CharacterList,
  },
  {
    path: "/characters/:id",
    name: "CharacterByID",
    component: CharacterByID,
  },
  {
    path: "/api/comics/page/:pagenum",
    name: "ComicList",
    component: ComicList,
  },
  {
    path: "/comics/:id",
    name: "ComicatID",
    component: ComicatID,
  },

  {
    path: "/api/stories/page/:pagenum",
    name: "StoryList",
    component: StoryList,
  },
  {
    path: "/stories/:id",
    name: "StoryatID",
    component: StoryatID,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});
createApp(App).use(router).mount("#app");

createApp(App).config.globalProperties.$log = console.log;
