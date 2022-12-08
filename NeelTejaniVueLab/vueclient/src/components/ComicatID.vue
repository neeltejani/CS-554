<template>
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
</template>
<script>
import axios from "axios";
export default {
  name: "ComicatID",
  data() {
    return {
      comic: [],
    };
  },
  created() {
    axios
      .get(
        "http://localhost:4000/comics/" +
          this.$route.params.id
      )
      .then(({ data }) => (this.comic = data));
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
