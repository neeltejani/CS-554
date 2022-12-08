<template>
  <div>
    <ul>
      <li v-for="(story, index) in stories" :key="index">
        <router-link
          :to="{
            name: 'StoryatID',
            params: { id: story.id },
          }"
        >
          {{ story.title }}
          <div>
            <img
              style="width: 200px; height: 200px"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1200px-No_image_available.svg.png"
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
  name: "StoryList",
  data() {
    return {
      stories: [],
    };
  },
  created() {
    axios
      .get(
        "http://localhost:4000/api/stories/page/" +
          this.$route.params.pagenum
      )
      .then(
        ({ data }) => (this.stories = data.data.results)
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
