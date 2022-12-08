const express = require("express");
const redis = require("redis");
const client = redis.createClient(6379);
const app = express();
const md5 = require("blueimp-md5");
const axios = require("axios");
const publickey = "31ad6d61aaf1fbb32cfd0a1552517454";
const privatekey = "840f7cdb2ea1dc93604204d3b53be769ef1c7faf";
const ts = new Date().getTime();
const stringToHash = ts + privatekey + publickey;
const hash = md5(stringToHash);
const baseUrlforcharacters =
  "https://gateway.marvel.com:443/v1/public/characters";
const baseUrlforcomics = "https://gateway.marvel.com:443/v1/public/comics";
const baseUrlforstories = "https://gateway.marvel.com:443/v1/public/stories";
var cors = require("cors");
app.use(cors());
async function getData(url) {
  let { data } = await axios.get(url);
  return data;
}

app.get("/", (req, res) => {
  res.send({ message: "We did it!" });
});

app.get("/api/characters/history", async (req, res) => {
  const answer = [];
  try {
    const history = await client.LRANGE("recently viewed character", 0, 19);
    if (history.length == 0) throw new Error(`No History Found`);

    for (let i = 0; i < 20 && i < history.length; i++) {
      answer.push(JSON.parse(history[i]));
    }
    res.status(200).json(answer);
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
});
app.get("/characters/:id", async (req, res) => {
  try {
    if (isNaN(req.params.id)) throw new Error(`ID must be in Number`);
    characterID = req.params.id;
    const cachedData = await client.hGet("CharacterForID", characterID);
    const key = "recently viewed character";
    if (cachedData) {
      await client.LPUSH(key, cachedData);
      return res.json(JSON.parse(cachedData));
    }
    const characterurlatpage =
      baseUrlforcharacters +
      "?id=" +
      characterID +
      "&ts=" +
      ts +
      "&apikey=" +
      publickey +
      "&hash=" +
      hash;
    try {
      const dataforPage = await getData(characterurlatpage);
      const finalData = dataforPage.data.results[0];
      await client.LPUSH(
        "recently viewed character",
        JSON.stringify(finalData)
      );
      await client.hSet(
        "CharacterForID",
        characterID,
        JSON.stringify(finalData)
      );
      return res.status(200).send(finalData);
    } catch (e) {
      res.status(404).send({ e });
    }
  } catch (e) {
    res.status(404).send({ error: e.message });
  }
});
app.get("/comics/:id", async (req, res) => {
  try {
    if (isNaN(req.params.id)) throw new Error(`ID must be in Number`);
    ComicID = req.params.id;
    const cachedData = await client.hGet("ComicForID", ComicID);
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }
    const comicurlatID =
      baseUrlforcomics +
      "?id=" +
      ComicID +
      "&ts=" +
      ts +
      "&apikey=" +
      publickey +
      "&hash=" +
      hash;
    try {
      const dataforPage = await getData(comicurlatID);
      const finalData = dataforPage.data.results[0];
      await client.hSet("ComicForID", ComicID, JSON.stringify(finalData));
      return res.status(200).json(finalData);
    } catch (e) {
      res.status(404).json({ e });
    }
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
});
app.get("/stories/:id", async (req, res) => {
  try {
    if (isNaN(req.params.id)) throw new Error(`ID must be in Number`);
    storyID = req.params.id;
    const cachedData = await client.hGet("StoryForID", storyID);
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }
    const characterurlatpage =
      baseUrlforstories +
      "?id=" +
      storyID +
      "&ts=" +
      ts +
      "&apikey=" +
      publickey +
      "&hash=" +
      hash;
    try {
      const dataforPage = await getData(characterurlatpage);
      const finalData = dataforPage.data.results[0];
      await client.hSet("StoryForID", storyID, JSON.stringify(finalData));
      return res.status(200).json(finalData);
    } catch (e) {
      res.status(404).json({ e });
    }
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
});
app.get("/api/characters/page/:pagenum", async (req, res) => {
  try {
    if (isNaN(req.params.pagenum)) throw new Error(`PageNum must be in Number`);
    if (!req.params.pagenum) throw new Error(`No Page num`);
    pageNum = req.params.pagenum;
    const cachedData = await client.hGet("Characters", pageNum);
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }
    const characterurlatpage =
      baseUrlforcharacters +
      "?limit=" +
      20 +
      "&offset=" +
      (req.params.pagenum - 1) * 20 +
      "&ts=" +
      ts +
      "&apikey=" +
      publickey +
      "&hash=" +
      hash;

    try {
      const finalData = await getData(characterurlatpage);
      if (finalData.data.results.length == 0) throw new Error("No data");
      await client.hSet("Characters", pageNum, JSON.stringify(finalData));
      return res.status(200).json(finalData);
    } catch (e) {
      res.status(404).json({ error: e.message });
    }
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
});
app.get("/api/comics/page/:pagenum", async (req, res) => {
  try {
    if (isNaN(req.params.pagenum)) throw new Error(`PageNum must be in Number`);
    pageNum = req.params.pagenum;
    const cachedData = await client.hGet("Comics", pageNum);
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }
    const comicsurlatpage =
      baseUrlforcomics +
      "?limit=" +
      20 +
      "&offset=" +
      (req.params.pagenum - 1) * 20 +
      "&ts=" +
      ts +
      "&apikey=" +
      publickey +
      "&hash=" +
      hash;
    try {
      const finalData = await getData(comicsurlatpage);
      await client.hSet("Comics", pageNum, JSON.stringify(finalData));
      return res.status(200).json(finalData);
    } catch (e) {
      res.status(404).json({ e });
    }
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
});
app.get("/api/stories/page/:pagenum", async (req, res) => {
  try {
    if (isNaN(req.params.pagenum)) throw new Error(`PageNum must be in Number`);
    pageNum = req.params.pagenum;
    const cachedData = await client.hGet("Stories", pageNum);
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }
    const storiesurlatpage =
      baseUrlforstories +
      "?limit=" +
      20 +
      "&offset=" +
      (req.params.pagenum - 1) * 20 +
      "&ts=" +
      ts +
      "&apikey=" +
      publickey +
      "&hash=" +
      hash;
    try {
      const finalData = await getData(storiesurlatpage);
      await client.hSet("Stories", pageNum, JSON.stringify(finalData));
      return res.status(200).json(finalData);
    } catch (e) {
      res.status(404).json({ e });
    }
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
});
app.get("/api/characters/search/:searchTerm", async (req, res) => {
  try {
    if (isNaN(req.params.searchTerm) == false)
      throw new Error(`searchTerm must be in String`);
    searchTerm = req.params.searchTerm;
    const cachedData = await client.hGet("SearchTermsCharacters", searchTerm);
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }
    const urlForSearchCharacter =
      baseUrlforcharacters +
      "?ts=" +
      ts +
      "&apikey=" +
      publickey +
      "&hash=" +
      hash +
      "&nameStartsWith=" +
      searchTerm;

    try {
      const finalData = await getData(urlForSearchCharacter);
      await client.hSet(
        "SearchTermsCharacters",
        searchTerm,
        JSON.stringify(finalData)
      );
      return res.status(200).json(finalData);
    } catch (e) {
      res.status(404).json({ e });
    }
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
});
app.get("/api/comics/search/:searchTerm", async (req, res) => {
  try {
    if (isNaN(req.params.searchTerm) == false)
      throw new Error(`searchTerm must be in String`);
    searchTerm = req.params.searchTerm;
    const cachedData = await client.hGet("SearchTermsComics", searchTerm);
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }
    const urlForSearchComics =
      baseUrlforcomics +
      "?ts=" +
      ts +
      "&apikey=" +
      publickey +
      "&hash=" +
      hash +
      "&titleStartsWith=" +
      searchTerm;
    console.log(urlForSearchComics);
    try {
      const finalData = await getData(urlForSearchComics);
      await client.hSet(
        "SearchTermsComics",
        searchTerm,
        JSON.stringify(finalData)
      );
      return res.status(200).json(finalData);
    } catch (e) {
      res.status(404).json({ e });
    }
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
});
app.get("/api/stories/search/:searchTerm", async (req, res) => {
  try {
    if (isNaN(req.params.searchTerm))
      throw new Error(`searchTerm must be in String`);
    searchTerm = req.params.searchTerm;
    const cachedData = await client.hGet("SearchTermsComics", searchTerm);
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }
    const urlForSearchStories =
      baseUrlforstories +
      "?ts=" +
      ts +
      "&apikey=" +
      publickey +
      "&hash=" +
      hash +
      "&comics=" +
      searchTerm;
    console.log(urlForSearchStories);
    try {
      const finalData = await getData(urlForSearchStories);
      await client.hSet(
        "SearchTermsComics",
        searchTerm,
        JSON.stringify(finalData)
      );
      return res.status(200).json(finalData);
    } catch (e) {
      res.status(404).json({ e });
    }
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
});
app.listen(4000, async () => {
  await client.connect();
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:4000");
});
