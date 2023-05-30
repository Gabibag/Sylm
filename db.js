
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
    searchSets: async function (query, maxResults, start) {
        let sets = await this.db.all("SELECT * FROM sets WHERE name LIKE ? OR desc LIKE ? LIMIT ?", ["%" + query + "%", "%" + query + "%", maxResults]);
        if(sets.length - start > maxResults){
            return sets.slice(start, start + maxResults);
        }
        console.log(sets.length - start);
        if(sets.length - start < maxResults){
            sets.push(...(await this.db.all("SELECT * FROM sets WHERE terms LIKE ? OR defs LIKE ? LIMIT ?", ["%" + query + "%", "%" + query + "%", maxResults - sets.length])));
        }
        return sets;
    },
    getLeaderboard: async function(setid, gameid, amount, start){
        console.log(amount +"  " + start);
        let leaderboard = await this.db.all("SELECT * FROM scores WHERE setid = ? AND game = ? ORDER BY score DESC LIMIT ?", [setid, gameid, (start + amount)]);
        if(leaderboard.length - start > amount){
            return leaderboard.slice(start, start + amount);
        }
        return leaderboard;
    },
    submitScore: async function(user, setid, gameid, score){
        await this.db.run('INSERT INTO scores VALUES (?, ?, ?, ?)', [setid, gameid, score, user.username]);
    },
    getSet: async function(id){
        return await this.db.get("SELECT * FROM sets WHERE id = ?", id);
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
    getSets: async function(user){
        return await this.db.all("SELECT * FROM sets WHERE author = ? LIMIT 15;", user.username);
    },
    createSetManual: async function(name, desc, author, terms, defs){
        let id = await this.getNewSetId();
        let b = await this.db.run("INSERT INTO sets VALUES (?, ?, ?, ?, ?, ?)", [id, util.espace(name), util.espace(desc), util.espace(author), util.espace(terms), util.espace(defs)]);
        return id;
    },
    createSet: async function(author, data){
        let id = await this.getNewSetId();
        let name = util.espace(data.name);
        let description = util.espace(data.description);
        let cards = util.espace(data.terms);
        if(cards.endsWith(util.separator)){
            cards = cards.substring(0, cards.length - 1);
        }
        let defs = util.espace(data.defs);
        console.log(util.separator);
        if(defs.endsWith(util.separator)){
            defs = defs.substring(0, defs.length - 1);
        }
        let b = await this.db.run("INSERT INTO sets VALUES (?, ?, ?, ?, ?, ?)", [id, name, description, author.username, cards, defs]);
        return id;
    },
    getUserFromReq: async function(req){
        return await this.db.get('SELECT * FROM users WHERE token = ?', req.cookies['token'])
    },
    getUser: async function (username) {
        console.log("Getting user");
        let user = await this.db.get('SELECT * FROM users WHERE username = ?', [username]);
        console.log(user);
        /*if (user == null || user instanceof Promise) {
            return null;
        }*/
        return await this.db.get('SELECT * FROM users WHERE username = ?', [username]);
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
        let user = await this.getUser(username);
        console.log(user);
        return user == null;

    },
    addUser: function (username, password) {
        let token = Hash(username + password);

        this.db.run('INSERT INTO users VALUES (?, ?, ?)', [username, password, token]);
    },
    getToken: function (username, password) {
        return Hash(username + password);
    }
};
function Hash(input) {
    return createHash('sha256').update(input).digest('hex');
}