<template>
  <div class="content">
    <ul>
      <li
        v-for="(character, index) in characters"
        :key="index"
      >
        <router-link
          :to="{
            name: 'CharacterByID',
            params: { id: character.id },
          }"
          ><div>
            {{ character.name }}
            <div>
              <img
                :src="
                  character.thumbnail.path +
                  '/portrait_incredible.' +
                  character.thumbnail.extension
                "
                class="img-fluid"
                alt=""
              />
            </div>
            <br />
            {{ character.modified }}
          </div>
        </router-link>
      </li>
    </ul>
  </div>
  <router-view></router-view>
</template>
<script>
import axios from "axios";

export default {
  name: "CharacterList",

  data() {
    return {
      characters: [],
      pagenum: 1,
    };
  },

  created() {
    axios
      .get(
        "http://localhost:4000/api/characters/page/" +
          this.$route.params.pagenum
      )
      .then(
        ({ data }) => (this.characters = data.data.results)
      );
  },

  paginatedData() {
    const start = this.pageNumber * this.size,
      end = start + this.size;
    return this.listData.slice(start, end);
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
