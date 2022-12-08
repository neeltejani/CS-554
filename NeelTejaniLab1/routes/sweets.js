const express = require("express");
const router = express.Router();
const data = require("../data");
const { checkUser } = require("../data/users");
const sweetData = data.sweets;
const userData = data.users;
const sweetMoods = [
    "Happy",
    "Sad",
    "Angry",
    "Excited",
    "Surprised",
    "Loved",
    "Blessed",
    "Greatful",
    "Blissful",
    "Silly",
    "Chill",
    "Motivated",
    "Emotional",
    "Annoyed",
    "Lucky",
    "Determined",
    "Bored",
    "Hungry",
    "Disappointed",
    "Worried",
];
router.get("/logout", async (req, res) => {
    try {
        if (req.session.userInfo.username == null) {
            res.status(200).json(`you havevt logged in yet`);
        } else {
            req.session.destroy();
            res.status(200).json(`You have been Logged out`);
        }
    } catch (e) {
        res.status(500).json(e);
    }
});
router.post("/:id/likes", async (req, res) => {
    try {
        if (!req.params.id) {
            throw "You must Supply and ID to get";
        }
        const userwhoLikedSweet = await sweetData.addLiketoSweets(
            req.session.userInfo._id,
            req.params.id
        );
        res.status(200).json(userwhoLikedSweet);
    } catch (e) {
        res.status(404).json({ error: e });
    }
});
router.get("/", async (req, res) => {
    try {
        const sweetList = await sweetData.getAllSweets(req.query.page);
        res.status(200).json(sweetList);
    } catch (e) {
        res.status(404).json({ error: e });
    }
});
router.get("/:id", async (req, res) => {
    try {
        if (!req.params.id) throw "You must Supply and ID to get";
        const sweetbyid = await sweetData.getSweetbyId(req.params.id);
        res.status(200).json(sweetbyid);
    } catch (e) {
        res.status(404).json({ error: e });
    }
});
router.post("/", async (req, res) => {
    try {
        const currentSweet = req.body;
        if (!req.body.sweetText) {
            throw `You have not entered sweetText`;
        }
        if (!req.body.sweetMood) {
            throw `You have not entered sweetMood`;
        }
        if (!typeof req.body.sweetText == String)
            throw `sweetText is not a string`;
        if (!typeof req.body.sweetMood == String)
            throw `sweetMood is not a string`;
        const { sweetText, sweetMood } = currentSweet;
        const gettingSweet = await sweetData.addSweets(
            req.session.userInfo._id,
            req.session.userInfo.username,
            sweetText,
            sweetMood
        );
        res.status(201).json(gettingSweet);
    } catch (e) {
        res.status(424).json({ error: e });
    }
});
router.patch("/:id", async (req, res) => {
    let updatedSweet = {};
    try {
        const requestBody = req.body;

        if (!requestBody.sweetText && !requestBody.sweetMood) {
            res.status(400).json(
                "sweetText or sweetMood need to have valid values"
            );
        }

        if (requestBody.sweetText) {
            if (
                typeof requestBody.sweetText != "string" ||
                requestBody.sweetText.trim().length == 0 ||
                isNaN(requestBody.sweetText) == false
            ) {
                throw " sweetText need to have valid values";
            }
        }
        if (requestBody.sweetMood) {
            if (
                typeof requestBody.sweetMood != "string" ||
                requestBody.sweetMood.trim().length == 0 ||
                isNaN(requestBody.sweetMood) == false
            ) {
                throw " sweetMood need to have valid values";
            }
        }

        if (!sweetMoods.includes(requestBody.sweetMood.toLowerCase())) {
            throw "Invalid sweetMood";
        }

        const oldSweet = await sweetData.getSweetbyId(req.params.id);

        if (
            requestBody.sweetText &&
            requestBody.sweetText != oldSweet.sweetText
        ) {
            updatedSweet.sweetText = requestBody.sweetText;
        }
        if (
            requestBody.sweetMood &&
            requestBody.sweetMood != oldSweet.sweetMood
        ) {
            updatedSweet.sweetMood = requestBody.sweetMood;
        }
    } catch (e) {
        return res.status(404).json({ error: e });
    }
    if (Object.keys(updatedSweet).length !== 0) {
        try {
            const finalSweet = await sweetData.updateSweets(
                req.session.userInfo._id,
                req.params.id,
                updatedSweet
            );
            res.status(200).json(finalSweet);
        } catch (e) {
            res.status(500).json({ error: e });
        }
    } else {
        res.status(400).json({
            error: "No fields have been changed from their inital values, so no update has occurred",
        });
    }
});
router.post("/:id/replies/", async (req, res) => {
    try {
        const requestBody = req.body;
        if (!req.params.id) {
            throw `You have not entered Reply id`;
        }
        if (!requestBody.reply) {
            throw `You have not entered reply`;
        }

        const repliedSweet = await sweetData.addReplytoSweets(
            req.session.userInfo._id,
            req.session.userInfo.username,
            req.params.id,
            requestBody.reply
        );
        res.status(201).json(repliedSweet);
    } catch (e) {
        res.status(424).json({ error: e });
    }
});
router.delete("/:sweetId/:replyId", async (req, res) => {
    try {
        if (!req.params.sweetId) throw `You havent provided SweetId`;
        if (!req.params.replyId) throw `You havent provided replyId`;
        await sweetData.deleteReplytoSweets(
            req.session.userInfo._id,
            req.params.sweetId,
            req.params.replyId
        );
        res.status(200).json(`Sweet Reply has been deleted`);
    } catch (e) {
        res.status(401).json({ error: e });
    }
});
router.post("/signup", async (req, res) => {
    try {
        const userPostData = req.body;
        if (!req.body.name) {
            throw `You have not entered name`;
        }
        if (!req.body.username) {
            throw `You have not entered username`;
        }
        if (!req.body.password) {
            throw `You have not entered password`;
        }

        if (!typeof req.body.name == String) throw `Name is not a string`;
        if (!typeof req.body.username == String)
            throw `Username is not a string`;
        if (!typeof req.body.password == String)
            throw `Password is not a string`;
        const { name, username, password } = userPostData;
        const newUser = await userData.addUser(name, username, password);
        res.status(201).json({
            _id: newUser._id,
            name: newUser.name,
            username: newUser.username,
        });
    } catch (e) {
        res.status(401).json({ error: e });
        return;
    }
});
router.post("/login", async (req, res) => {
    try {
        const userLoginData = req.body;
        if (!req.body.username) {
            throw `You have not entered username`;
        }
        if (!req.body.password) {
            throw `You have not entered password`;
        }
        if (!typeof req.body.username == String)
            throw `Username is not a string`;
        if (!typeof req.body.password == String)
            throw `Password is not a string`;
        const { username, password } = userLoginData;
        const checkUser = await userData.checkUser(username, password);
        req.session.userInfo = {
            _id: checkUser._id,
            name: checkUser.name,
            username: checkUser.username,
            password: checkUser.password,
        };

        return res.status(200).json({
            _id: checkUser._id,
            name: checkUser.name,
            username: checkUser.username,
        });
    } catch (e) {
        res.status(401).json({ error: e });
    }
});

module.exports = router;
