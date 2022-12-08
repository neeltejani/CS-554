const mongoCollections = require("../config/mongoCollections");
const { ObjectId } = require("mongodb");
const sweets = mongoCollections.sweets;
const users = mongoCollections.users;
const bcrypt = require("bcrypt");
const saltRounds = 10;
var letterNumber = /^[0-9a-zA-Z]+$/;
var number = /^[0-9]+$/;
var letter = /^[A-Za-z]+$/;
async function getAllUsers() {
    const userCollection = await users();
    const allUsers = userCollection.find({}).toArray();
    return allUsers;
}
async function getUserbyID(id) {
    if (!id) throw `you haven't pass the id.`;
    if (typeof id !== "string") throw "Id must be a string";
    try {
        parsedId = ObjectId(id);
    } catch (e) {
        throw `id is not in valid format`;
    }
    const userCollection = await users();
    const user = userCollection.findOne({ _id: parsedId });
    if (user == null) throw "No users found";
    return user;
}
async function addUser(name, username, password) {
    if (!name) {
        throw "name need to have valid values";
    }
    if (!username) {
        throw "Username need to have valid values";
    }
    if (!password) {
        throw "Password need to have valid values";
    }
    if (
        typeof name != "string" ||
        name.trim().length == 0 ||
        !name.match(letter) ||
        name.length < 2
    ) {
        throw "Entered name Is in invalid format";
    }
    if (
        typeof username != "string" ||
        username.trim().length == 0 ||
        username.match(" ") ||
        !username.match(letterNumber) ||
        username.length < 4
    ) {
        throw "Entered userName Is in invalid format";
    }
    if (
        typeof password != "string" ||
        password.trim().length == 0 ||
        password.match(" ") ||
        password.length < 6
    ) {
        throw "Entered password Is in invalid format";
    }
    if (username)
        if (isPassword(password) == false) throw `Range of password is invalid`;
    const lowerCaseUsername = username.toLowerCase();
    const hashPassword = await bcrypt.hash(password, saltRounds);
    const userCollection = await users();

    const insertInfo = await userCollection.findOne({
        username: lowerCaseUsername,
    });
    if (insertInfo != null) throw "User Already Exists with the username";

    const findUser = {
        name: name,
        username: username,
        password: hashPassword,
    };
    const newUser = await userCollection.insertOne(findUser);
    const newid = newUser.insertedId;

    return await getUserbyID(newid.toString());
}
async function checkUser(username, password) {
    if (!username) {
        throw "Username need to have valid values";
    }
    if (!password) {
        throw "Password need to have valid values";
    }

    if (
        typeof username != "string" ||
        username.trim().length == 0 ||
        username.match(" ") ||
        !username.match(letterNumber) ||
        username.length < 4
    ) {
        throw "Entered userName Is in invalid format";
    }
    if (
        typeof password != "string" ||
        password.trim().length == 0 ||
        password.match(" ") ||
        password.length < 6
    ) {
        throw "Entered password Is in invalid format";
    }
    const usersCollection = await users();
    const userInfo = await usersCollection.findOne({ username: username });
    if (userInfo == null) throw "No user exists with given username";
    const flag = await bcrypt.compare(password, userInfo.password);
    if (flag) return userInfo;
    else throw "Either Username or Password is wrong";
}
async function removeUser(id) {
    if (!id) throw "Id parameter must be supplied";

    if (typeof id !== "string") throw "Id must be a string";
    const userCollection = await users();
    userCollection.deleteOne({ _id: ObjectId(id) });
}
function isPassword(inputtxt) {
    const passre = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    if (inputtxt.match(passre)) {
        return true;
    } else {
        return false;
    }
}

module.exports = { getAllUsers, getUserbyID, addUser, removeUser, checkUser };
