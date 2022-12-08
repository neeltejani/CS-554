const mongoCollections = require("../config/mongoCollections");
const { ObjectId } = require("mongodb");
const res = require("express/lib/response");
const sweetMoods = [
    "happy",
    "sad",
    "angry",
    "excited",
    "surprised",
    "loved",
    "blessed",
    "greatful",
    "blissful",
    "silly",
    "chill",
    "motivated",
    "emotional",
    "annoyed",
    "lucky",
    "determined",
    "bored",
    "hungry",
    "disappointed",
    "worried",
];
var letterNumber = /^[0-9a-zA-Z]+$/;
const sweets = mongoCollections.sweets;
const users = mongoCollections.users;
async function getAllSweets(page) {
    try {
        const sweetCollection = await sweets();
        if (page > 1) {
            const allSweets = await sweetCollection
                .find({})
                .skip(50 * (page - 1))
                .limit(50)
                .toArray();
            if (allSweets.length == 0) throw `There are no more sweets`;
            return allSweets;
        } else {
            const allSweets = await sweetCollection
                .find({})
                .limit(50)
                .toArray();
            if (allSweets.length == 0) throw `There are no more sweets`;
            return allSweets;
        }
    } catch (e) {
        throw e;
    }
}
async function getSweetbyId(id) {
    if (!id) throw "you haven't supllied an id";
    if (typeof id !== "string") throw "id must be a string";

    try {
        parsedId = ObjectId(id);
    } catch (e) {
        throw `Id format is wrong`;
    }
    const sweetCollection = await sweets();
    const sweet = await sweetCollection.findOne({ _id: parsedId });
    if (sweet == null) throw "No sweets found for this id";
    return sweet;
}

async function addSweets(userid, userName, sweetText, sweetMood) {
    if (
        (typeof userid !== "string") |
        (typeof userName !== "string") |
        (typeof sweetText !== "string") |
        (typeof sweetMood !== "string")
    ) {
        throw "$ input is not string";
    }
    if (!userid) {
        throw "userid need to have valid values";
    }
    if (!userName) {
        throw "userName need to have valid values";
    }
    if (!sweetText) {
        throw "sweetText need to have valid values";
    }
    if (!sweetMood) {
        throw "sweetMood need to have valid values";
    }
    if (userName.trim().length == 0) {
        throw "Entered userName Is in invalid format";
    }
    if (
        (userName == "") |
        (typeof userName == "undefined") |
        (userName === null) |
        (userName === NaN)
    ) {
        throw "$ check the username";
    }

    if (sweetMood.trim().length == 0) {
        throw "Entered sweetMood Is in invalid format";
    }
    if (
        (sweetText == "") |
        (typeof sweetText == "undefined") |
        (sweetText === null) |
        (sweetText === NaN)
    ) {
        throw "$ check the sweetText";
    }

    if (sweetText.trim().length == 0) {
        throw "Entered sweetText Is in invalid format";
    }
    if (
        (sweetMood == "") |
        (typeof sweetMood == "undefined") |
        (sweetMood === null) |
        (sweetMood === NaN)
    ) {
        throw "$ check the sweetMood";
    }
    if (!sweetMoods.includes(sweetMood.toLowerCase())) {
        throw "Invalid sweetMood";
    }

    const sweetCollection = await sweets();

    const findSweets = {
        sweetText: sweetText,
        sweetMood: sweetMood,
        userThatPosted: { _id: userid, username: userName },
        replies: [],
        likes: [],
    };
    const newSweet = await sweetCollection.insertOne(findSweets);
    const newid = newSweet.insertedId;
    const final = await getSweetbyId(newid.toString());
    return final;
}
async function updateSweets(userid, id, sweetObject) {
    if (!userid) throw "you haven't supllied an userid";
    if (typeof userid !== "string") throw "userid must be a string";
    if (!id) throw "you haven't supllied an id";
    if (typeof id !== "string") throw "Id must be a string";

    try {
        parsedId = ObjectId(userid);
    } catch (e) {
        throw `userid format is wrong`;
    }
    try {
        parsedId = ObjectId(id);
    } catch (e) {
        throw `Id format is wrong`;
    }

    if (!sweetObject) throw `you havent supplied sweetObject object`;
    if (typeof sweetObject !== "object") {
        throw "$ input is not object";
    }

    const sweetCollection = await sweets();
    await sweetCollection.updateOne(
        {
            _id: parsedId,
        },
        { $set: sweetObject }
    );
    const updatedSweet = await getSweetbyId(id);
    return updatedSweet;
}
async function addReplytoSweets(
    replyinguserid,
    replyinguserName,
    sweetid,
    reply
) {
    if (!replyinguserid) throw `not getting the userid from session`;
    if (!replyinguserName) throw `not getting username from session`;
    if (!sweetid) throw `you havent supplied an sweetid`;
    if (!reply) throw `Reply has not been supplied`;
    if (typeof replyinguserid !== "string")
        throw "replyinguserid must be a string";
    if (typeof replyinguserName !== "string")
        throw "replyinguserName must be a string";
    if (typeof sweetid !== "string") throw "sweetid must be a string";
    try {
        parsedId = ObjectId(sweetid);
    } catch (e) {
        throw `Id format is wrong`;
    }
    if (typeof reply != "string" || reply.trim().length == 0) {
        throw "Entered reply Is in invalid format";
    }

    const sweetCollection = await sweets();
    await getSweetbyId(sweetid);
    const replyWithId = {
        _id: ObjectId(),

        userThatPostedReply: {
            _id: replyinguserid,
            username: replyinguserName,
        },

        reply,
    };
    await sweetCollection.updateOne(
        { _id: parsedId },

        { $push: { replies: replyWithId } }
    );
    return await getSweetbyId(sweetid);
}

async function deleteReplytoSweets(userid, sweetid, replyid) {
    if (!userid) throw `You have not supplied userid`;
    if (typeof userid !== "string") throw "userid must be a string";
    if (!sweetid) throw `You have not supplied sweetid`;
    if (typeof sweetid !== "string") throw "sweetid must be a string";
    if (!replyid) throw `You have not supplied userid`;
    if (typeof replyid !== "string") throw "replyid must be a string";

    try {
        parsedReplyid = ObjectId(userid);
    } catch (e) {
        throw `userid is not in valid format`;
    }
    try {
        parsedReplyid = ObjectId(sweetid);
    } catch (e) {
        throw `sweetid is not in valid format`;
    }
    try {
        parsedReplyid = ObjectId(replyid);
    } catch (e) {
        throw `replyid is not in valid format`;
    }
    try {
        const sweetCollection = await sweets();

        const sweetcontainsreply = await sweetCollection.findOne({
            "replies._id": parsedReplyid,
        });
        if (sweetcontainsreply == null)
            throw `There are no sweet which has this reply`;
        for (let i = 0; i < sweetcontainsreply.replies.length; i++) {
            if (sweetcontainsreply.replies[i]._id == replyid) {
                await sweetCollection.updateOne(
                    { "replies._id": parsedReplyid },
                    { $pull: { replies: sweetcontainsreply.replies[i] } }
                );
            }
        }

        return `sweet reply has been deleted`;
    } catch (e) {
        console.log(e);
    }
}
async function addLiketoSweets(userid, sweetid) {
    like = [];
    if (!userid) throw `You have not supplied userid`;
    if (!sweetid) throw `You have not supplied sweetid`;
    if (typeof userid !== "string") throw "userId must be a string";
    if (typeof sweetid !== "string") throw "sweetId must be a string";
    try {
        parsedsweetId = ObjectId(sweetid);
    } catch (e) {
        res.json(e);
    }
    try {
        parseduserId = ObjectId(userid);
    } catch (e) {
        res.json(e);
    }
    const sweetCollection = await sweets();
    const sweetforLike = await getSweetbyId(sweetid);
    token = 0;
    for (let i = 0; i <= sweetforLike.likes.length; i++) {
        if (sweetforLike.likes[i] == userid) {
            token = 1;
            await sweetCollection.updateOne(
                { _id: parsedsweetId },
                { $pull: { likes: sweetforLike.likes[i] } }
            );
        }
    }
    if (token == 1) return `Post DisLiked`;
    else
        await sweetCollection.updateOne(
            { _id: parsedsweetId },
            { $push: { likes: userid } }
        );
    return `post liked`;
}

module.exports = {
    getAllSweets,
    getSweetbyId,
    addSweets,
    updateSweets,
    addReplytoSweets,
    deleteReplytoSweets,
    addLiketoSweets,
};
