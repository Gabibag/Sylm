const sqlite3 = require('sqlite3').verbose();
const {createHash } = require('crypto');
const db = new sqlite3.Database('./db.sqlite3', (err) => {
    console.log(err);
});
module.exports = {
    db: db,
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
    vaildUser : function(username, password) {
        db.all('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, rows) => {
            if (err ||rows == undefined ||  rows.length == 0) {
                console.log(err);
                return false;
            }
            if (rows.length > 0) {
                return true;
            }
            return false;
        });
     },
    addUser: function(username, password) {
        let token = Hash(username + password);

        db.run('INSERT INTO users VALUES (?, ?, ?)', [username, password, token]);
    }
};
function Hash(input){ 
    createHash('sha256').update(input).digest('hex');
}