const express = require("express");
const redis = require("redis");
const client = redis.createClient(6379);
const app = express();
const axios = require("axios");
const md5 = require("blueimp-md5");
const res = require("express/lib/response");
const publickey = "31ad6d61aaf1fbb32cfd0a1552517454";
const privatekey = "840f7cdb2ea1dc93604204d3b53be769ef1c7faf";
const ts = new Date().getTime();
const stringToHash = ts + privatekey + publickey;
const hash = md5(stringToHash);

// CHARACTER URL
const baseUrl1 = "https://gateway.marvel.com:443/v1/public/characters";
//COMICS URL
const baseUrl2 = "https://gateway.marvel.com:443/v1/public/comics";
//STORIES URL
const baseUrl3 = "https://gateway.marvel.com:443/v1/public/stories";
async function getData(url) {
    let { data } = await axios.get(url);
    return data;
}
app.get("/api/characters", async (req, res) => {
    try {
        const url1 =
            baseUrl1 + "?ts=" + ts + "&apikey=" + publickey + "&hash=" + hash;
        const data1 = await getData(url1);

        res.status(200).json(data1);
    } catch (e) {
        res.status(404).json({ error: e.message });
    }
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
app.get("/api/characters/:id", async (req, res) => {
    try {
        if (isNaN(req.params.id)) throw new Error(`Id must be in Number`);
        characterId = req.params.id;
        const cachedData = await client.hGet("characters", characterId);
        const key = "recently viewed character";
        if (cachedData) {
            await client.LPUSH(key, cachedData);
            return res.json(JSON.parse(cachedData));
        }
        const characterurlatID =
            baseUrl1 +
            "/" +
            characterId +
            "?ts=" +
            ts +
            "&apikey=" +
            publickey +
            "&hash=" +
            hash;
        try {
            const dataforId = await getData(characterurlatID);
            const finalData = dataforId.data.results[0];
            await client.LPUSH(
                "recently viewed character",
                JSON.stringify(finalData)
            );
            await client.hSet(
                "characters",
                characterId,
                JSON.stringify(finalData)
            );
            return res.status(200).json(finalData);
        } catch (e) {
            res.status(404).json({ error: `No data found for this id` });
        }
    } catch (e) {
        res.status(404).json({ error: e.message });
    }
});

app.get("/api/comics/:id", async (req, res) => {
    try {
        if (isNaN(req.params.id)) throw new Error(`Id must be in Number`);
        comicsId = req.params.id;
        const cachedData = await client.get(comicsId);

        if (cachedData) {
            return res.json(JSON.parse(cachedData));
        }
        const comicsurlatID =
            baseUrl2 +
            "/" +
            comicsId +
            "?ts=" +
            ts +
            "&apikey=" +
            publickey +
            "&hash=" +
            hash;
        try {
            const dataforId = await getData(comicsurlatID);
            const dataatId = dataforId.data.results[0];
            res.status(200).json(dataatId);
            await client.set(comicsId, JSON.stringify(dataatId));
        } catch (e) {
            res.status(404).json({ error: `No data found for this id` });
        }
    } catch (e) {
        res.status(404).json({ error: e.message });
    }
});
app.get("/api/stories/:id", async (req, res) => {
    try {
        if (isNaN(req.params.id)) throw new Error(`Id must be in Number`);
        storiesID = req.params.id;
        const cachedData = await client.get(storiesID);
        if (cachedData) {
            return res.json(JSON.parse(cachedData));
        }
        const storiesurlatID =
            baseUrl3 +
            "/" +
            storiesID +
            "?ts=" +
            ts +
            "&apikey=" +
            publickey +
            "&hash=" +
            hash;
        try {
            const dataforId = await getData(storiesurlatID);
            const finalData = dataforId.data.results[0];
            res.json(finalData);
            await client.set(storiesID, JSON.stringify(finalData));
        } catch (e) {
            res.status(404).json({ error: `No data found for this id` });
        }
    } catch (e) {
        res.status(404).json({ error: e.message });
    }
});

app.listen(3000, async () => {
    await client.connect();
    console.log("We've now got a server!");
    console.log("Your routes will be running on http://localhost:3000");
});
