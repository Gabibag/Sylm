
const sqlite3 = require('sqlite3').verbose();
let invaildChars = ["'", '"', '`', ' ', ";", ":", ",", ".", "/", "\\", "|", "[", "]", "{", "}", "(", ")", "="];
const { createHash } = require('crypto');
const { AsyncDatabase } = require("promised-sqlite3");
async function init () {
    console.log("Database opened");
      module.exports.db = await AsyncDatabase.open("./db.sqlite");
      console.log("Database opened");
}
const util = require('./util.js');
module.exports = {
    init: init,
    db: null,
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
    acceptableUserName: function (username) {
        if (username.length < 4) {
            return false;
        }
        for (let c of username) {
            if (invaildChars.includes(c)) {
                return false;
            }
        }
        //TODO check if username is taken
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