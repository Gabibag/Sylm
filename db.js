const sqlite3 = require('sqlite3').verbose();
let invaildChars = ["'", '"', '`', ' ', ";", ":", ",", ".", "/", "\\", "|", "[", "]", "{", "}", "(", ")", "="];
const {createHash } = require('crypto');
const db = new sqlite3.Database('./db.sqlite3', (err) => {
    console.log(err);
});
const util = require('./util.js');
module.exports = {
    acceptableUserName: function (username) {
        if(db.getUser(username)){
            return false;
        }
        for (let c of invaildChars) {   
            if (username.includes(c)) {
                return false;
            }
        }
        return username.length > 3 && username.length < 20;
    },
    acceptablePassword : function (password) {
        for (let c of invaildChars) {
            if (password.includes(c)) {
                return false;
            }
        }
        return password.length > 3 && password.length < 20;
    },
    db: db,
    getUser: function(username) {
       db.all('SELECT * FROM users WHERE username = ?', [username], function(err, rows) {
            if (err) {
                console.log(err);
            }
            if (rows.length > 0) {
                return rows[0];
            }
            return false;
        }
        );
    },
    loggedIn: function(req){
        let cookies = util.getAllCookieDict(req);
        console.log(cookies)
        if(cookies.token){
            return this.vaildateToken(cookies.token)
        }
        return false;
    },
    vaildateToken: function(token) {
        db.all('SELECT * FROM users WHERE token = ?', [token], (err, rows) => {
            if (err) {
                console.log(err);
            }
            if (rows.length > 0) {
                return true;
            }
            return false;
        });
    },
    vaildUser : async function(username, password) {
       let r = await db.all("SELECT * FROM users WHERE username = '"+ username+"' AND password = '"+password+"';")
       console.log(r)
     },
    addUser: function(username, password) {
        let token = Hash(username + password);

        db.run('INSERT INTO users VALUES (?, ?, ?)', [username, password, token]);
    },
    getToken: function(username, password) {
        let token = Hash(username + password);
        return token;
    }
};
function Hash(input){ 
    return createHash('sha256').update(input).digest('hex');
}