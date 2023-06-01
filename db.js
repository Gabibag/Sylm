
const sqlite3 = require('sqlite3').verbose();
let invaildChars = ["'", '"', '`', ' ', ";", ":", ",", ".", "/", "\\", "|", "[", "]", "{", "}", "(", ")", "="];
const { createHash } = require('crypto');
const { AsyncDatabase } = require("promised-sqlite3");
async function init() {
    console.log("database starting");
    module.exports.db = await AsyncDatabase.open("./db.sqlite");
    console.log("Database opened");
}
const vaildChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-_"
const util = require('./util.js');
module.exports = {
    init: init,
    db: null,
    searchSets: async function (query, maxResults, start) {
        let sets = await this.db.all("SELECT * FROM sets WHERE name LIKE ? OR desc LIKE ? LIMIT ?", ["%" + query + "%", "%" + query + "%", maxResults]);
        if(sets.length - start > maxResults){
            return sets.slice(start, start + maxResults);
        }
        if(sets.length - start < maxResults){
            sets.push(...(await this.db.all("SELECT * FROM sets WHERE terms LIKE ? OR defs LIKE ? LIMIT ?", ["%" + query + "%", "%" + query + "%", maxResults - sets.length])));
        }
        return sets;
    },
    getLeaderboard: async function(setid, gameid, amount, start){
        
        let leaderboard = await this.db.all("SELECT * FROM scores WHERE setid = ? AND game = ? ORDER BY score DESC LIMIT ?", [setid, gameid, (start + amount)]);
        
        if(leaderboard.length - start > amount){
            return leaderboard.slice(start, start + amount);
        }

        return leaderboard.slice(start, start + amount);
    },
    submitScore: async function (user, setid, gameid, score) {
        if (score > 301000) {
            console.log("Score not submitted, too high: " + score + "(user: " + user.username + ") flagging user as cheater");
            if (!user.username.includes("cheater")) {
                await this.db.run('UPDATE users SET username = ? WHERE password = ? AND token = ?', [user.username + " [cheater]", user.password, user.token]);
            }
            return;
        }
        if (user.username.includes("cheater") && score > 28000) {
            console.log("Score not submitted, user suspected of cheating: " + score + "(user: " + user.username + ")");
            return;
        }
        if (setid == null || gameid == null || score == null || score < 0) {
            return;
        }
        await this.db.run('INSERT INTO scores VALUES (?, ?, ?, ?)', [setid, gameid, score, user.username]);
    },
    setUserName: async function (user, name) {
        if (user == null || name == null) {
            return;
        }
        await this.db.run('UPDATE users SET name = ? WHERE username = ?', [name, user.username]);
    },
    changeScore: async function (user, setid, gameid, score) {
        if (user == null || setid == null || gameid == null || score == null || score > 3010000000 || score < 0) {
            return;
        }
        await this.db.run('UPDATE scores SET score = ? WHERE setid = ? AND game = ? AND user = ?', [score, setid, gameid, user.username]);
    },
    getSet: async function (id) {
        return await this.db.get("SELECT * FROM sets WHERE id = ?", id);
    },
    getNewSetId: async function () {
        let id = "";
        for (let i = 0; i < 9; i++) {
            id += vaildChars[Math.floor(Math.random() * vaildChars.length)];
        }
        if ((await this.db.get("SELECT * FROM sets WHERE id = ?", id)) == null) {
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
        let user = await this.db.get('SELECT * FROM users WHERE username = ?', [username]);
        
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
        if (username.toLowerCase().includes("cheater")) {
            return false;
        }
        let user = await this.getUser(username.toLowerCase());

        return user == null;

    },
    getGames: async function () {
        return await this.db.all("SELECT * FROM games;");
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