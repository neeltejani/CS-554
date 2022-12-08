<template>
  <div>
    <ul>
      <li v-for="(comic, index) in comics" :key="index">
        <router-link
          :to="{
            name: 'ComicatID',
            params: { id: comic.id },
          }"
        >
          {{ comic.title }}
          <div>
            <img
              :src="
                comic.thumbnail.path +
                '/portrait_incredible.' +
                comic.thumbnail.extension
              "
              class="img-fluid"
              alt=""
            />
          </div>
        </router-link>
      </li>
    </ul>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "CharacterList",
  data() {
    return {
      comics: [],
    };
  },
  created() {
    axios
      .get(
        "http://localhost:4000/api/comics/page/" +
          this.$route.params.pagenum
      )
      .then(
        ({ data }) => (this.comics = data.data.results)
      );
  },
};
</script>

<style scoped>
ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
}
ul li {
  padding: 20px;
  font-size: 1.3em;
  background-color: #e0edf4;
  border-left: 5px solid #3eb3f6;
  margin-bottom: 2px;
  color: #3e5252;
}
p {
  text-align: center;
  padding: 30px 0;
  color: gray;
}
</style>
