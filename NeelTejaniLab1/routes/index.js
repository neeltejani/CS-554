const sweetRoutes = require("./sweets");

const constructorMethod = (app) => {
    app.use("/sweets", sweetRoutes);

    app.use("*", (req, res) => {
        res.status(404).json({ error: "Not found" });
    });
};

module.exports = constructorMethod;
