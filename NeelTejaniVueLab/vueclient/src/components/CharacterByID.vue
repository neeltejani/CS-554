<template>
  <div>
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
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "CharacterByID",
  data() {
    return {
      character: [],
    };
  },
  created() {
    axios
      .get(
        "http://localhost:4000/characters/" +
          this.$route.params.id
      )
      .then(({ data }) => (this.character = data));
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
