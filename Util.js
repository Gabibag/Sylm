let invaildChars = ["'", '"', '`', ' ', ";", ":", ",", ".", "/", "\\", "|", "[", "]", "{", "}", "(", ")", "="];
const db = require('./db.js')
module.exports = {
    getAllCookieDict : function(req){
        let cookies = this.getAllCookies(req);
        let cookieObj = {};
        for(let c of cookies){
            let split = c.split('=');
            cookieObj[split[0]] = split[1];
        }
        return cookieObj;
    },
    //as a string
    getAllCookies: function (req) {
        var cookie = req.headers.cookie;
        return cookie.split('; ');
    },
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
    }
};