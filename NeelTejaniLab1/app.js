const express = require("express");
const app = express();
const data = require("./data");
const sweetData = data.sweets;
const configRoutes = require("./routes");
const session = require("express-session");

app.use(express.json());
app.use(
    session({
        name: "Lab1Cookie",
        secret: "some secret string!",
        resave: false,
        saveUninitialized: true,
    })
);

app.get("/sweets/logout", (req, res, next) => {
    if (req.session.userInfo == null) {
        return res.status(401).json({ message: "Do Login to logout" });
    }
    next();
});
app.post("/sweets/login", (req, res, next) => {
    if (req.session.userInfo != null) {
        return res.status(401).json({ message: "User is already logged in " });
    }
    next();
});
app.post("/sweets/:id/likes", (req, res, next) => {
    if (req.session.userInfo == null) {
        return res.status(401).json({ message: "Do Login to post Like" });
    }
    next();
});
app.post("/sweets", (req, res, next) => {
    if (req.session.userInfo == null) {
        return res.status(401).json({ message: "Do Login to post SWEET" });
    }
    next();
});
app.post("/sweets/:id/replies/", (req, res, next) => {
    if (req.session.userInfo == null) {
        return res.status(401).json({ message: "Do Login to post Reply" });
    }
    next();
});
app.patch("/sweets/:id", async (req, res, next) => {
    if (req.session.userInfo == null) {
        return res.status(401).json({ message: "Do Login to Update SWEET" });
    }
    try {
        const sweet = await sweetData.getSweetbyId(req.params.id);
        if (sweet.userThatPosted._id != req.session.userInfo._id) {
            return res.status(403).json({
                error: `You Can not Update the Sweet as you havent posted the Sweet`,
            });
        }
    } catch (e) {}
    next();
});
app.delete("/sweets/:sweetId/:replyId", async (req, res, next) => {
    if (req.session.userInfo == null) {
        return res.status(401).json({ message: "Do Login to Delete SWEET" });
    }
    try {
        const sweet = await sweetData.getSweetbyId(req.params.sweetId);
        for (x of sweet.replies) {
            if (
                x._id.toString() === req.params.replyId &&
                req.session.userInfo._id ===
                    x.userThatPostedReply._id.toString()
            ) {
                await sweetCollection.updateOne(
                    { _id: ObjectId(req.params.sweetId) },
                    { $pull: { replies: sweet.replies._id } }
                );
            }
        }
        return res.status(401).json({ message: "Done" });
    } catch (e) {}
    next();
});

configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log("Your routes will be running on http://localhost:3000");
});
