
const sqlite3 = require('sqlite3').verbose();
let invaildChars = ["'", '"', '`', ' ', ";", ":", ",", ".", "/", "\\", "|", "[", "]", "{", "}", "(", ")", "="];
const { createHash } = require('crypto');
const { AsyncDatabase } = require("promised-sqlite3");
async function init() {
    module.exports.db = await AsyncDatabase.open("./db.sqlite");
    console.log("Database opened");
}
const vaildChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
const util = require('./util.js');
module.exports = {
    init: init,
    db: null,
    getLeaderboard: async function(setid, gameid){
        let board = await this.db.all("SELECT * FROM scores WHERE setid = ? AND game = ?", [setid, gameid]);
        return board;
    },
    submitScore: async function(user, setid, gameid, score){
        await this.db.run('INSERT INTO scores VALUES (?, ?, ?, ?)', [setid, gameid, score, user.username]);
    },
    getSet: async function(id){
        let set = await this.db.get("SELECT * FROM sets WHERE id = ?", id);
        return set;
    },
    getNewSetId: async function(){
        let id = "";
        for(let i = 0; i < 9; i++){
            id += vaildChars[Math.floor(Math.random() * vaildChars.length)];
        }
        if((await this.db.get("SELECT * FROM sets WHERE id = ?", id)) == null){
            return id;
        }else{
            return this.getNewSetId();
        }
    },
    createSet: async function(author, data){
        console.log("Creating set");
        let id = await this.getNewSetId();
        console.log(id)
        let name = data.name;
        let description = data.description;
        let cards = data.terms;
        if(cards.endsWith(",")){
            cards = cards.substring(0, cards.length - 1);
        }
        let b = await this.db.run("INSERT INTO sets VALUES (?, ?, ?, ?, ?)", [id, name, description, author.username, cards]);
        return id;
    },
    getUserFromReq: async function(req){
        let t = req.cookies['token'];
        let user = await this.db.get('SELECT * FROM users WHERE token = ?', t);
        return user
    },
    getUser: async function (username) {
        let user = await this.db.get('SELECT * FROM users WHERE username = ?', [username]);
        return user;
    },
    acceptablePassword: function (password) {
        if (password.length < 8) {
            return false;
        }
        for (let c of password) {
            if (invaildChars.includes(c)) {
                return false;
            }
        }
        return true;
    },
    loggedIn: async function (req) {
        let token = req.cookies['token'];
        let user = await this.db.get("SELECT * FROM users WHERE token = ?;", token)
        return user != null;
    },
    acceptableUserName: async function (username) {
        if (username.length < 4) {
            return false;
        }
        for (let c of username) {
            if (invaildChars.includes(c)) {
                return false;
            }
        }
        console.log(this.getUser(username));
        if(await this.getUser(username) != null){
            return false;
        }
        return true;
    },
    addUser: function (username, password) {
        let token = Hash(username + password);

        this.db.run('INSERT INTO users VALUES (?, ?, ?)', [username, password, token]);
    },
    getToken: function (username, password) {
        let token = Hash(username + password);
        return token;
    }
};
function Hash(input) {
    return createHash('sha256').update(input).digest('hex');
}