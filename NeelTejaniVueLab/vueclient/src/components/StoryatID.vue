<template>
  {{ story.title }}
  <br />
  <br />
  <div>
    <img
      style="width: 300px; height: 300px"
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1200px-No_image_available.svg.png"
    />
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "StoryatID",
  data() {
    return {
      story: [],
    };
  },
  created() {
    axios
      .get(
        "http://localhost:4000/stories/" +
          this.$route.params.id
      )
      .then(({ data }) => (this.story = data));
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
