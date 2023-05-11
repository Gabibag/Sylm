const sqlite3 = require('sqlite3').verbose();
const {createHash } = require('crypto');
const db = new sqlite3.Database('./db.sqlite3', (err) => {
    console.log(err);
});
const util = require('./util.js');
module.exports = {
    db: db,
    getUser: function(username) {
        db.all('SELECT * FROM users WHERE username = ?', [username], (err, rows) => {
            if (err) {
                console.log(err);
            }
            return rows[0];
        });
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